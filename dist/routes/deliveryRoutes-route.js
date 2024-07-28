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
exports.deliveryRoutesRoute = void 0;
const express_1 = require("express");
const delivery_routes_service_1 = require("../services/delivery-routes-service");
exports.deliveryRoutesRoute = (0, express_1.Router)({});
exports.deliveryRoutesRoute.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const deliveryRoute = yield delivery_routes_service_1.deliveryRoutesService.getDeliveryRoutes(userId);
        res.send(deliveryRoute);
    }
    catch (e) {
        next(e);
    }
}));
exports.deliveryRoutesRoute.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const deliveryRoute = yield delivery_routes_service_1.deliveryRoutesService.getDeliveryRoutesById(req.params.id, userId);
        res.send(deliveryRoute);
    }
    catch (e) {
        next(e);
    }
}));
exports.deliveryRoutesRoute.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const userId = req.user.id;
        const deliveryRoute = yield delivery_routes_service_1.deliveryRoutesService.createDeliveryRoute(body, userId);
        res.send(deliveryRoute);
    }
    catch (e) {
        next(e);
    }
}));
exports.deliveryRoutesRoute.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const deliveryRoute = yield delivery_routes_service_1.deliveryRoutesService.removeDeliveryRoute(id, userId);
        res.send(deliveryRoute);
    }
    catch (e) {
        next(e);
    }
}));
exports.deliveryRoutesRoute.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveryRouteId = req.params.id;
        const body = req.body;
        const userId = req.user.id;
        const deliveryRoute = yield delivery_routes_service_1.deliveryRoutesService.updateDeliveryRoute(deliveryRouteId, body, userId);
        res.send(deliveryRoute);
    }
    catch (e) {
        next(e);
    }
}));
exports.deliveryRoutesRoute.put('/sort/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const userId = req.user.id;
        const deliveryRoute = yield delivery_routes_service_1.deliveryRoutesService.sortDeliveryRoute(body, userId);
        res.send(deliveryRoute);
    }
    catch (e) {
        next(e);
    }
}));
//# sourceMappingURL=deliveryRoutes-route.js.map