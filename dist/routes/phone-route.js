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
exports.phoneRoute = void 0;
const express_1 = require("express");
const phone_service_1 = require("../services/phone-service");
exports.phoneRoute = (0, express_1.Router)({});
exports.phoneRoute.post('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const idClient = req.params.id;
        if (idClient) {
            const phone = yield phone_service_1.phoneService.createPhone(body, idClient);
            res.send(phone);
        }
    }
    catch (e) {
        next(e);
    }
}));
exports.phoneRoute.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const idClient = req.params.id;
        if (idClient) {
            const phone = yield phone_service_1.phoneService.removePhone(body.idPhone, idClient);
            res.send(phone);
        }
    }
    catch (e) {
        next(e);
    }
}));
//# sourceMappingURL=phone-route.js.map