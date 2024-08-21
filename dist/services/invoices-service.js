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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
            const invoice = Object.assign(Object.assign({}, body), { orderItems: invoiceOrderItems, totalAmount,
                finalTotalAmount,
                userId });
            return yield invoices_db_repositories_1.invoicesRepositories.createInvoice(invoice);
        });
    },
    deleteInvoicesByBriefcaseId(briefcaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield invoices_db_repositories_1.invoicesRepositories.deleteManyInvoices({ briefcaseId });
        });
    },
    getTotalWeightByBriefcaseId(briefcaseId) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const invoices = yield invoices_db_repositories_1.invoicesRepositories.getInvoicesByBriefcase(briefcaseId);
            const res = {};
            try {
                for (var _d = true, invoices_1 = __asyncValues(invoices), invoices_1_1; invoices_1_1 = yield invoices_1.next(), _a = invoices_1_1.done, !_a; _d = true) {
                    _c = invoices_1_1.value;
                    _d = false;
                    const invoice = _c;
                    for (const inv of invoice.orderItems) {
                        const name = inv.name;
                        if (res[name]) {
                            res[name] += inv.weight;
                        }
                        else {
                            res[name] = inv.weight;
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = invoices_1.return)) yield _b.call(invoices_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return res;
        });
    }
};
//# sourceMappingURL=invoices-service.js.map