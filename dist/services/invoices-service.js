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
    getInvoicesById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield invoices_db_repositories_1.invoicesRepositories.getInvoicesById(id);
        });
    },
    getOrderInvoiceById(briefcaseId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield invoices_db_repositories_1.invoicesRepositories.getOrderInvoiceById(briefcaseId, orderId);
        });
    },
    createInvoice(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoiceOrderItems = [];
            let totalAmount = 0;
            for (const item of body.orderItems) {
                const product = yield db_1.catalogCollection.findOne({ _id: new mongodb_1.ObjectId(item.productId) });
                const amount = +(product.price * item.weight).toFixed(2);
                totalAmount += amount;
                invoiceOrderItems.push(Object.assign(Object.assign({}, item), { productPrice: product.price, name: product.name, amount: amount, units: item.units, comments: item.comments }));
            }
            totalAmount = +(totalAmount + body.priceDelivery).toFixed(2);
            const finalTotalAmount = +(totalAmount * (1 - body.discount / 100)).toFixed(2);
            const invoice = Object.assign(Object.assign({}, body), { orderItems: invoiceOrderItems, totalAmount,
                finalTotalAmount });
            return yield invoices_db_repositories_1.invoicesRepositories.createInvoice(invoice);
        });
    }
};
//# sourceMappingURL=invoices-service.js.map