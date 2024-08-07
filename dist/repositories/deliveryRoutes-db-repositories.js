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
exports.deliveryRoutesRepositories = void 0;
const db_1 = require("./db");
const mongodb_1 = require("mongodb");
exports.deliveryRoutesRepositories = {
    getDeliveryRoutes(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.deliveryRoutesCollection.find({ userId }).toArray();
        });
    },
    getDeliveryRoutesById(id, userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const deliveryRoute = yield db_1.deliveryRoutesCollection.findOne({ _id: new mongodb_1.ObjectId(id), userId });
            const result = Object.assign(Object.assign({}, deliveryRoute), { orders: [] });
            if ((deliveryRoute === null || deliveryRoute === void 0 ? void 0 : deliveryRoute.briefcases) && ((_a = deliveryRoute === null || deliveryRoute === void 0 ? void 0 : deliveryRoute.briefcases) === null || _a === void 0 ? void 0 : _a.length) >= 0) {
                for (const deliveryRouteBriefcase of deliveryRoute.briefcases) {
                    const briefcase = yield db_1.briefcaseCollection.findOne({ id: deliveryRouteBriefcase.id });
                    const orders = [];
                    for (const deliveryRouteOrderId of deliveryRouteBriefcase.orderIds) {
                        orders.push(...briefcase.orders.filter(order => {
                            if (order.orderId === deliveryRouteOrderId.orderId) {
                                order.sort = deliveryRouteOrderId.sort;
                                order.briefcaseId = deliveryRouteBriefcase.id;
                                order.time = deliveryRouteOrderId.time;
                                return order;
                            }
                        }));
                    }
                    // const orders = briefcase.orders.filter(order => deliveryRouteBriefcase.orderIds.includes(order.orderId));
                    for (const order of orders) {
                        const client = yield db_1.clientCollection.findOne({ id: order.clientId });
                        order.dataClient = {
                            name: client.name,
                            status: client.status,
                            source: client.source,
                            phones: client.phones,
                            addresses: client.addresses
                        };
                    }
                    result.orders.push(...orders);
                }
            }
            const sortOrder = (a, b) => {
                return (a.sort > b.sort) ? 1 : -1;
            };
            result.orders.sort(sortOrder);
            return result;
        });
    },
    createDeliveryRoute(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.deliveryRoutesCollection.insertOne(body);
        });
    },
    removeDeliveryRoutes(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.deliveryRoutesCollection.deleteOne({ _id: new mongodb_1.ObjectId(id), userId });
        });
    },
    updateDeliveryRoute(id, body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.deliveryRoutesCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(body._id), userId }, { $set: { name: body.name } });
        });
    },
    sortDeliveryRoute(body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.deliveryRoutesCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(body._id), userId }, { $set: { briefcases: body.briefcases } });
        });
    }
};
//# sourceMappingURL=deliveryRoutes-db-repositories.js.map