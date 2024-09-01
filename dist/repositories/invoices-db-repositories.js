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
exports.invoicesRepositories = void 0;
const db_1 = require("./db");
const mongodb_1 = require("mongodb");
exports.invoicesRepositories = {
    getInvoicesById(id, userId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const deliveryRoute = yield db_1.deliveryRoutesCollection.findOne({ _id: new mongodb_1.ObjectId(id), userId });
            const result = Object.assign(Object.assign({}, deliveryRoute), { orders: [], drTotalAmount: 0 });
            if ((deliveryRoute === null || deliveryRoute === void 0 ? void 0 : deliveryRoute.briefcases) && ((_a = deliveryRoute === null || deliveryRoute === void 0 ? void 0 : deliveryRoute.briefcases) === null || _a === void 0 ? void 0 : _a.length) >= 0) {
                for (const deliveryRouteBriefcase of deliveryRoute.briefcases) {
                    const resBrief = yield db_1.briefcaseCollection.aggregate([
                        { $match: { id: deliveryRouteBriefcase.id, userId } },
                        {
                            $project: {
                                id: 1,
                                name: 1,
                                createdDate: 1,
                                orders: {
                                    $filter: {
                                        input: "$orders",
                                        as: "order",
                                        cond: { $eq: ["$$order.deliveryRoute._id", id] }
                                    }
                                }
                            }
                        },
                        {
                            $unwind: "$orders"
                        },
                        {
                            $lookup: {
                                from: "clients",
                                localField: "orders.clientId",
                                foreignField: "id",
                                as: "orderClientData"
                            }
                        },
                        {
                            $unwind: {
                                path: "$orderClientData",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $group: {
                                _id: "$_id",
                                id: { $first: "$id" },
                                orders: {
                                    $push: {
                                        $mergeObjects: [
                                            "$orders",
                                            {
                                                dataClient: {
                                                    name: "$orderClientData.name",
                                                    status: "$orderClientData.status",
                                                    source: "$orderClientData.source",
                                                    phones: "$orderClientData.phones",
                                                    addresses: "$orderClientData.addresses"
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    ]).toArray();
                    const briefcase = resBrief[0];
                    const orderMap = new Map();
                    for (const order of briefcase.orders) {
                        orderMap.set(order.orderId, order);
                    }
                    for (const deliveryRouteOrderId of deliveryRouteBriefcase.orderIds) {
                        const order = orderMap.get(deliveryRouteOrderId.orderId);
                        if (order) {
                            result.drTotalAmount += (_b = order.finalTotalAmount) !== null && _b !== void 0 ? _b : 0;
                            order.sort = deliveryRouteOrderId.sort;
                            order.briefcaseId = deliveryRouteBriefcase.id;
                            order.time = deliveryRouteOrderId.time;
                        }
                    }
                    result.orders.push(...briefcase.orders);
                }
            }
            const sortOrder = (a, b) => {
                return (a.sort > b.sort) ? 1 : -1;
            };
            result.orders.sort(sortOrder);
            return result;
        });
    },
    createInvoice(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { orderId: body.orderId };
            const update = { $set: body };
            const options = { upsert: true };
            return yield db_1.invoicesCollection.updateOne(query, update, options);
        });
    },
    getOrderInvoiceById(briefcaseId, orderId, userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const briefcase = yield db_1.briefcaseCollection.aggregate([
                { $match: { id: briefcaseId, userId } },
                {
                    $project: {
                        orders: {
                            $filter: {
                                input: "$orders",
                                as: "order",
                                cond: { $eq: ["$$order.orderId", orderId] }
                            }
                        }
                    }
                }
            ]).toArray();
            const order = (_a = briefcase[0].orders[0]) !== null && _a !== void 0 ? _a : null;
            if (order) {
                order.userId = userId;
            }
            return order;
        });
    },
    getDR(drId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.deliveryRoutesCollection.findOne({ _id: new mongodb_1.ObjectId(drId) });
        });
    },
    deleteManyInvoices(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.invoicesCollection.deleteMany(query);
        });
    },
    getInvoicesByBriefcase(briefcaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.invoicesCollection.find({ briefcaseId });
        });
    }
};
//# sourceMappingURL=invoices-db-repositories.js.map