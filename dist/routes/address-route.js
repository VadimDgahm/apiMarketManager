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
exports.addressRoute = void 0;
const express_1 = require("express");
const address_service_1 = require("../services/address-service");
exports.addressRoute = (0, express_1.Router)({});
exports.addressRoute.post('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const idClient = req.params.id;
        if (idClient) {
            const address = yield address_service_1.addressService.createAddress(body, idClient);
            res.send(address);
        }
    }
    catch (e) {
        next(e);
    }
}));
exports.addressRoute.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const idClient = req.params.id;
        if (idClient) {
            const address = yield address_service_1.addressService.removeAddress(body.idAddress, idClient);
            res.send(address);
        }
    }
    catch (e) {
        next(e);
    }
}));
exports.addressRoute.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const idClient = req.params.id;
        if (idClient) {
            const address = yield address_service_1.addressService.updateAddress(body, idClient);
            res.send(address);
        }
    }
    catch (e) {
        next(e);
    }
}));
//# sourceMappingURL=address-route.js.map