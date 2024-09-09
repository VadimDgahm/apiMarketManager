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
exports.briefcaseRoute = void 0;
const express_1 = require("express");
const briefcase_service_1 = require("../services/briefcase-service");
exports.briefcaseRoute = (0, express_1.Router)({});
// @ts-ignore
exports.briefcaseRoute.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let briefcases = yield briefcase_service_1.briefcaseService.getBriefcase(req.user.id);
    res.send(briefcases);
}));
// @ts-ignore
exports.briefcaseRoute.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const briefcase = yield briefcase_service_1.briefcaseService.getBriefcaseById(req.params.id, req.user.id);
    if (briefcase) {
        res.send(briefcase);
    }
    else {
        res.status(404).send('not Found');
    }
}));
// @ts-ignore
exports.briefcaseRoute.get('/purchase/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const briefcase = yield briefcase_service_1.briefcaseService.getBriefcaseByIdPurchase(req.params.id, req.user.id);
    if (briefcase) {
        res.send(briefcase);
    }
    else {
        res.status(404).send('not Found');
    }
}));
exports.briefcaseRoute.post('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idBriefcase = req.params.id;
    const body = req.body;
    if (idBriefcase) {
        const order = yield briefcase_service_1.briefcaseService.createOrder(idBriefcase, body);
        res.send(order);
    }
    else
        res.status(500).send('not remove');
}));
// @ts-ignore
exports.briefcaseRoute.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let briefcaseUser = yield briefcase_service_1.briefcaseService.createBriefcase(req.body, req.user.id);
    res.send(briefcaseUser);
}));
exports.briefcaseRoute.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    if (id) {
        yield briefcase_service_1.briefcaseService.removeBriefcase(id);
        res.send({ message: `${id} успешно удален` });
    }
    else {
        next(`${id} не удален по непонятным причинам`);
    }
}));
exports.briefcaseRoute.get('/:id/purchases', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idBriefcase = req.params.id;
    if (idBriefcase) {
        const purchases = yield briefcase_service_1.briefcaseService.getPurchases(idBriefcase);
        res.send(purchases);
    }
    else
        res.status(500).send('not remove');
}));
exports.briefcaseRoute.delete('/:id/orders/:orderId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idBriefcase = req.params.id;
    const orderId = req.params.orderId;
    if (idBriefcase && orderId) {
        const order = yield briefcase_service_1.briefcaseService.removeOrder(idBriefcase, orderId);
        res.send(order);
    }
    else
        res.status(500).send('not remove');
}));
exports.briefcaseRoute.put('/:id/orders/:orderId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idBriefcase = req.params.id;
    const orderId = req.params.orderId;
    const body = req.body;
    if (idBriefcase && orderId) {
        const order = yield briefcase_service_1.briefcaseService.updateOrderClient(idBriefcase, body, orderId);
        res.send(order);
    }
    else
        res.status(500).send('not remove');
}));
exports.briefcaseRoute.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idBriefcase = req.params.id;
    const body = req.body;
    if (idBriefcase) {
        const briefcase = yield briefcase_service_1.briefcaseService.changeBriefcase(idBriefcase, body, req.user.id);
        res.send(briefcase);
    }
    else
        res.status(500).send('not change');
}));
exports.briefcaseRoute.put('/:id/orders/:orderId/deliveryRoute', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idBriefcase = req.params.id;
    const orderId = req.params.orderId;
    const body = req.body;
    if (idBriefcase && orderId) {
        const order = yield briefcase_service_1.briefcaseService.updateOrderDeliveryRoute(idBriefcase, body, orderId);
        res.send(order);
    }
    else
        res.status(500).send('not change');
}));
//# sourceMappingURL=briefcase-route.js.map