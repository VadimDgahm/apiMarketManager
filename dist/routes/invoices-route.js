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
exports.invoicesRoute = void 0;
const express_1 = require("express");
const invoices_service_1 = require("../services/invoices-service");
exports.invoicesRoute = (0, express_1.Router)({});
exports.invoicesRoute.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const invoice = yield invoices_service_1.invoicesService.getInvoicesById(req.params.id, userId);
        res.send(invoice);
    }
    catch (e) {
        next(e);
    }
}));
exports.invoicesRoute.get('/receipt/:briefcase/:order', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const orderInvoice = yield invoices_service_1.invoicesService.getOrderInvoiceById(req.params.briefcase, req.params.order, userId);
        res.send(orderInvoice);
    }
    catch (e) {
        next(e);
    }
}));
exports.invoicesRoute.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const createInvoice = yield invoices_service_1.invoicesService.createInvoice(req.body, userId);
        res.send(createInvoice);
    }
    catch (e) {
        next(e);
    }
}));
exports.invoicesRoute.get('/totalweight/:briefcase', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalWeight = yield invoices_service_1.invoicesService.getTotalWeightByBriefcaseId(req.params.briefcase);
        res.send(totalWeight);
    }
    catch (e) {
        next(e);
    }
}));
//# sourceMappingURL=invoices-route.js.map