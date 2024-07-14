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
            return yield invoices_db_repositories_1.invoicesRepositories.createInvoice(body);
        });
    }
};
//# sourceMappingURL=invoices-service.js.map