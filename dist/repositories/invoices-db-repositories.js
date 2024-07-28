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
    getInvoicesById(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const deliveryRoute = yield db_1.deliveryRoutesCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            const result = Object.assign(Object.assign({}, deliveryRoute), { orders: [], drTotalAmount: 0 });
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
                    for (const order of orders) {
                        const client = yield db_1.clientCollection.findOne({ id: order.clientId });
                        order.dataClient = {
                            name: client.name,
                            status: client.status,
                            source: client.source,
                            phones: client.phones,
                            addresses: client.addresses
                        };
                        const invoice = yield db_1.invoicesCollection.findOne({ orderId: order.orderId });
                        if (invoice) {
                            order.invoiceOrderItems = invoice.orderItems;
                            order.totalAmount = invoice.totalAmount;
                            order.finalTotalAmount = invoice.finalTotalAmount;
                            order.discount = invoice.discount;
                            order.priceDelivery = invoice.priceDelivery;
                            result.drTotalAmount += order.finalTotalAmount;
                        }
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
    createInvoice(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { orderId: body.orderId };
            const update = { $set: body };
            const options = { upsert: true };
            return yield db_1.invoicesCollection.updateOne(query, update, options);
        });
    },
    getOrderInvoiceById(briefcaseId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.briefcaseCollection.findOne({ id: briefcaseId });
            if (res) {
                const order = res.orders.find((o) => o.orderId === orderId);
                const invoice = yield db_1.invoicesCollection.findOne({ orderId: order.orderId });
                if (invoice) {
                    order.invoiceOrderItems = invoice.orderItems;
                    order.totalAmount = invoice.totalAmount;
                    order.finalTotalAmount = invoice.finalTotalAmount;
                    order.discount = invoice.discount;
                    order.priceDelivery = invoice.priceDelivery;
                }
                return order;
            }
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
    }
};
//# sourceMappingURL=invoices-db-repositories.js.map