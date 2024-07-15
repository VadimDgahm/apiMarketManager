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
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const deliveryRoute = yield db_1.deliveryRoutesCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            const result = Object.assign(Object.assign({}, deliveryRoute), { drTotalAmount: 0, orders: [] });
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
                        const invoice = yield db_1.invoicesCollection.findOne({ orderId: order.orderId });
                        if (invoice) {
                            const invoiceOrderItems = [];
                            let totalAmount = 0;
                            for (const invoiceOrderItem of invoice.orderItems) {
                                const product = yield db_1.catalogCollection.findOne({ _id: new mongodb_1.ObjectId(invoiceOrderItem.productId) });
                                const comments = (_b = order.orderClient.find((orderItem) => orderItem.positionId === invoiceOrderItem.positionId)) === null || _b === void 0 ? void 0 : _b.comments;
                                const amount = +(product.price * invoiceOrderItem.weight).toFixed(2);
                                totalAmount += amount;
                                invoiceOrderItems.push(Object.assign(Object.assign({}, invoiceOrderItem), { productPrice: product.price, name: product.name, amount: amount, comments: comments }));
                            }
                            order.invoiceOrderItems = invoiceOrderItems;
                            order.totalAmount = +totalAmount.toFixed(2) + invoice.priceDelivery;
                            order.finalTotalAmount = +(order.totalAmount * (1 - invoice.discount / 100)).toFixed(2);
                            order.discount = invoice.discount;
                            order.priceDelivery = invoice.priceDelivery;
                            result.drTotalAmount += +order.finalTotalAmount.toFixed(2);
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
                    const invoiceOrderItems = [];
                    let totalAmount = 0;
                    for (const item of invoice.orderItems) {
                        const product = yield db_1.catalogCollection.findOne({ _id: new mongodb_1.ObjectId(item.productId) });
                        const amount = +(product.price * item.weight).toFixed(2);
                        totalAmount += amount;
                        invoiceOrderItems.push(Object.assign(Object.assign({}, item), { productPrice: product.price, name: product.name, amount: amount, units: item.units }));
                    }
                    order.invoiceOrderItems = invoiceOrderItems;
                    order.totalAmount = +totalAmount.toFixed(2) + invoice.priceDelivery;
                    order.finalTotalAmount = +(order.totalAmount * (1 - invoice.discount / 100)).toFixed(2);
                    order.discount = invoice.discount;
                    order.priceDelivery = invoice.priceDelivery;
                }
                return order;
            }
        });
    }
};
//# sourceMappingURL=invoices-db-repositories.js.map