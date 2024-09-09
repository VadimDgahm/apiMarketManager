"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.briefcaseRepositories = void 0;
const db_1 = require("./db");
const mongodb_1 = require("mongodb");
const invoices_service_1 = require("../services/invoices-service");
exports.briefcaseRepositories = {
    getBriefcase(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const briefcase = yield db_1.briefcaseCollection.find({ userId }).toArray();
            if (briefcase) {
                return briefcase.reverse();
            }
            else {
                return [];
            }
        });
    },
    getBriefcaseById(briefcaseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resBrief = yield db_1.briefcaseCollection.aggregate([
                { $match: { id: briefcaseId, userId } },
                {
                    $lookup: {
                        from: "clients",
                        localField: "orders.clientId",
                        foreignField: "id",
                        as: "orderClientData"
                    }
                },
                {
                    $project: {
                        id: 1,
                        name: 1,
                        createdDate: 1,
                        userId: 1,
                        orders: {
                            $reverseArray: {
                                $map: {
                                    input: "$orders",
                                    as: "order",
                                    in: {
                                        $mergeObjects: [
                                            "$$order",
                                            {
                                                dataClient: {
                                                    $arrayElemAt: [
                                                        {
                                                            $filter: {
                                                                input: "$orderClientData",
                                                                as: "client",
                                                                cond: { $eq: ["$$client.id", "$$order.clientId"] }
                                                            }
                                                        },
                                                        0
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            ]).toArray();
            return resBrief[0];
        });
    },
    getBriefcaseByIdPurchase(briefcaseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resBrief = yield db_1.briefcaseCollection.aggregate([
                { $match: { id: briefcaseId, userId } },
                {
                    $lookup: {
                        from: "clients",
                        localField: "orders.clientId",
                        foreignField: "id",
                        as: "orderClientData"
                    }
                },
                {
                    $unwind: "$orders"
                },
                {
                    $lookup: {
                        from: "catalog",
                        let: { productIds: "$orders.orderClient.productId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: [{ $toObjectId: "$_id" }, { $map: { input: "$$productIds", as: "pid", in: { $toObjectId: "$$pid" } } }]
                                    }
                                }
                            },
                            { $project: { _id: 0, productId: "$_id", sortValue: 1 } } // Убираем _id, оставляем только productId и sortValue
                        ],
                        as: "catalogData"
                    }
                },
                {
                    $project: {
                        id: 1,
                        name: 1,
                        createdDate: 1,
                        userId: 1,
                        orders: {
                            $mergeObjects: [
                                "$orders",
                                {
                                    orderClient: {
                                        $map: {
                                            input: "$orders.orderClient",
                                            as: "clientProduct",
                                            in: {
                                                $mergeObjects: [
                                                    "$$clientProduct",
                                                    {
                                                        sortValue: {
                                                            $ifNull: [
                                                                {
                                                                    $arrayElemAt: [
                                                                        {
                                                                            $map: {
                                                                                input: {
                                                                                    $filter: {
                                                                                        input: "$catalogData",
                                                                                        as: "catalogItem",
                                                                                        cond: { $eq: ["$$catalogItem.productId", { $toObjectId: "$$clientProduct.productId" }] }
                                                                                    }
                                                                                },
                                                                                as: "filteredCatalog",
                                                                                in: "$$filteredCatalog.sortValue"
                                                                            }
                                                                        },
                                                                        0
                                                                    ]
                                                                },
                                                                0
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        orders: { $push: "$orders" },
                        id: { $first: "$id" },
                        name: { $first: "$name" },
                        createdDate: { $first: "$createdDate" },
                        userId: { $first: "$userId" }
                    }
                }
            ]).toArray();
            return resBrief[0];
        });
    },
    createBriefcase(order) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.briefcaseCollection.insertOne(order);
            return order;
        });
    },
    createOrder(idBriefcase, body) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.briefcaseCollection.updateOne({ id: idBriefcase }, { $addToSet: { orders: body } });
            yield db_1.clientCollection.updateOne({ id: body.clientId }, { $push: { order: body } });
            return body;
        });
    },
    removeBriefcase(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.briefcaseCollection.deleteOne({ id });
            if (res.deletedCount) {
                yield invoices_service_1.invoicesService.deleteInvoicesByBriefcaseId(id);
            }
        });
    },
    getPurchases(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.briefcaseCollection.findOne({ id });
        });
    },
    removeOrder(idBriefcase, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.briefcaseCollection.findOne({ id: idBriefcase });
            if (res) {
                const order = res.orders.find((o) => o.orderId === orderId);
                yield db_1.invoicesCollection.deleteOne({ orderId: order.orderId });
                yield db_1.clientCollection.updateOne({ id: order.clientId }, { $pull: { order: { orderId } } });
                yield db_1.briefcaseCollection.updateOne({ id: idBriefcase }, { $pull: { orders: { orderId } } });
                if (order) {
                    return order;
                }
            }
        });
    },
    changeBriefcase(idBriefcase, body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.briefcaseCollection.findOneAndUpdate({ id: idBriefcase, userId }, { $set: { name: body.name } });
        });
    },
    updateOrderClient(idBriefcase, body, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const briefcase = yield db_1.briefcaseCollection.findOne({ id: idBriefcase });
            const orderIndex = briefcase.orders.findIndex(order => orderId === order.orderId);
            const client = yield db_1.clientCollection.findOne({ id: briefcase.orders[orderIndex].clientId });
            if (briefcase && client) {
                const updateArr = briefcase.orders.map(order => order.orderId === orderId ? Object.assign(Object.assign({}, order), body) : order);
                const updateArrForCLient = client.order.map(order => order.orderId === orderId ? Object.assign(Object.assign({}, order), body) : order);
                yield db_1.clientCollection.findOneAndUpdate({ id: briefcase.orders[orderIndex].clientId }, { $set: { order: updateArrForCLient } });
                return yield db_1.briefcaseCollection.findOneAndUpdate({ id: idBriefcase }, { $set: { orders: updateArr } });
            }
            return false;
        });
    },
    updateOrderDeliveryRoute(idBriefcase, body, orderId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const briefcase = yield db_1.briefcaseCollection.findOne({ id: idBriefcase });
            const orderIndex = briefcase.orders.findIndex(order => orderId === order.orderId);
            let time = '';
            // Delete an order in the old delivery route
            if (body.oldDeliveryRouteId) {
                const OldDeliveryRoute = yield db_1.deliveryRoutesCollection.findOne({ _id: new mongodb_1.ObjectId(body.oldDeliveryRouteId) });
                if (OldDeliveryRoute) {
                    const OldDeliveryRouteIndex = OldDeliveryRoute.briefcases.findIndex(briefcase => briefcase.id === idBriefcase);
                    OldDeliveryRoute.briefcases[OldDeliveryRouteIndex].orderIds = OldDeliveryRoute.briefcases[OldDeliveryRouteIndex].orderIds.filter(oId => {
                        if (oId.orderId !== orderId) {
                            return oId;
                        }
                        else {
                            time = oId.time;
                        }
                    });
                    if (OldDeliveryRoute.briefcases[OldDeliveryRouteIndex].orderIds.length === 0) {
                        OldDeliveryRoute.briefcases = OldDeliveryRoute.briefcases.filter(briefcase => briefcase.id !== idBriefcase);
                    }
                    yield db_1.deliveryRoutesCollection.findOneAndUpdate({ _id: OldDeliveryRoute._id }, { $set: { briefcases: OldDeliveryRoute.briefcases } });
                }
            }
            // Add a new order to the delivery route
            const newDeliveryRoute = yield db_1.deliveryRoutesCollection.findOne({ _id: new mongodb_1.ObjectId(body._id) });
            const deliveryRouteIndex = (_a = newDeliveryRoute === null || newDeliveryRoute === void 0 ? void 0 : newDeliveryRoute.briefcases) === null || _a === void 0 ? void 0 : _a.findIndex(briefcase => briefcase.id === idBriefcase);
            const newOrderIdObj = { orderId: orderId, sort: Math.floor(Date.now() / 1000), time: time };
            if (isFinite(deliveryRouteIndex) && deliveryRouteIndex !== -1) {
                const isExist = newDeliveryRoute.briefcases[deliveryRouteIndex].orderIds.find(item => item.orderId === newOrderIdObj.orderId);
                if (!isExist) {
                    newDeliveryRoute.briefcases[deliveryRouteIndex].orderIds.push(newOrderIdObj);
                }
            }
            else if (((_b = newDeliveryRoute.briefcases) === null || _b === void 0 ? void 0 : _b.length) >= 0) {
                newDeliveryRoute.briefcases.push({ id: idBriefcase, orderIds: [newOrderIdObj] });
            }
            else {
                newDeliveryRoute.briefcases = [{ id: idBriefcase, orderIds: [newOrderIdObj] }];
            }
            if (briefcase && newDeliveryRoute) {
                briefcase.orders[orderIndex].deliveryRoute = { _id: body._id, name: body.name };
                const resultDR = yield db_1.deliveryRoutesCollection.findOneAndUpdate({ _id: newDeliveryRoute._id }, { $set: newDeliveryRoute });
                if (resultDR) {
                    return yield db_1.briefcaseCollection.findOneAndUpdate({ id: idBriefcase }, { $set: { orders: briefcase.orders } });
                }
                return;
            }
        });
    }
};
//# sourceMappingURL=briefcase-db-repositories.js.map