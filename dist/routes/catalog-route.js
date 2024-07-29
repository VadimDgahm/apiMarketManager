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
exports.catalogRoute = void 0;
const express_1 = require("express");
const catalog_service_1 = require("../services/catalog-service");
exports.catalogRoute = (0, express_1.Router)({});
// @ts-ignore
exports.catalogRoute.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const users = yield catalog_service_1.catalogService.getCatalog(userId);
        res.send(users);
    }
    catch (e) {
        next(e);
    }
}));
// @ts-ignore
exports.catalogRoute.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const users = yield catalog_service_1.catalogService.createProduct(Object.assign({ userId: req.user.id }, body));
        res.send(users);
    }
    catch (e) {
        next(e);
    }
}));
// @ts-ignore
exports.catalogRoute.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const users = yield catalog_service_1.catalogService.removeProduct(id, req.user.id);
        res.send(users);
    }
    catch (e) {
        next(e);
    }
}));
exports.catalogRoute.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const body = req.body;
        const users = yield catalog_service_1.catalogService.changeProduct(productId, req.user.id, body);
        res.send(users);
    }
    catch (e) {
        next(e);
    }
}));
//# sourceMappingURL=catalog-route.js.map