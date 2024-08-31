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
exports.invoicesService = void 0;
const invoices_db_repositories_1 = require("../repositories/invoices-db-repositories");
const db_1 = require("../repositories/db");
const mongodb_1 = require("mongodb");
exports.invoicesService = {
    getInvoicesById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield invoices_db_repositories_1.invoicesRepositories.getInvoicesById(id, userId);
        });
    },
    getOrderInvoiceById(briefcaseId, orderId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield invoices_db_repositories_1.invoicesRepositories.getOrderInvoiceById(briefcaseId, orderId, userId);
        });
    },
    createInvoice(body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoiceOrderItems = [];
            let totalAmount = 0;
            for (const item of body.orderItems) {
                const product = yield db_1.catalogCollection.findOne({ _id: new mongodb_1.ObjectId(item.productId) });
                let amount = 0;
                if (!item.isGift) {
                    amount = +(product.price * item.weight).toFixed(2);
                }
                totalAmount += amount;
                invoiceOrderItems.push(Object.assign(Object.assign({}, item), { productPrice: product.price, name: product.name, amount: amount, units: item.units, comments: item.comments }));
            }
            totalAmount = +(totalAmount + body.priceDelivery).toFixed(2);
            const finalTotalAmount = +(totalAmount * (1 - body.discount / 100)).toFixed(2);
            const updatedFields = {
                "orders.$[order].invoiceOrderItems": invoiceOrderItems,
                "orders.$[order].discount": body.discount,
                "orders.$[order].priceDelivery": body.priceDelivery,
                "orders.$[order].markOrder": body.markOrder,
                "orders.$[order].totalAmount": totalAmount,
                "orders.$[order].finalTotalAmount": finalTotalAmount
            };
            const result = yield db_1.briefcaseCollection.updateOne({ "orders.orderId": body.orderId }, { $set: updatedFields }, {
                arrayFilters: [{ "order.orderId": body.orderId }],
                upsert: false
            });
            console.log(`${result.modifiedCount} документ(ов) обновлено`);
            return result;
        });
    },
    deleteInvoicesByBriefcaseId(briefcaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield invoices_db_repositories_1.invoicesRepositories.deleteManyInvoices({ briefcaseId });
        });
    },
    getTotalWeightByBriefcaseId(briefcaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const brief = yield db_1.briefcaseCollection.findOne({ id: briefcaseId });
            const res = {};
            for (const order of brief.orders) {
                if (order.invoiceOrderItems) {
                    for (const item of order.invoiceOrderItems) {
                        const name = item.name;
                        if (res[name]) {
                            res[name] += item.weight;
                        }
                        else {
                            res[name] = item.weight;
                        }
                    }
                }
            }
            return res;
        });
    }
};
//# sourceMappingURL=invoices-service.js.map