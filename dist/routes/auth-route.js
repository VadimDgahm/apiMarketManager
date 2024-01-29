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
exports.authRoute = void 0;
const express_1 = require("express");
const auth_service_1 = require("../services/auth-service");
exports.authRoute = (0, express_1.Router)({});
exports.authRoute.post('/registration', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userData = yield auth_service_1.authService.registration(email, password);
        // res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60* 1000, httpOnly: true})
        res.send(userData);
    }
    catch (e) {
        res.status(400).send(e.message);
    }
}));
exports.authRoute.post('/login', (req, res, next) => {
    try {
    }
    catch (e) {
        console.log(e);
    }
});
exports.authRoute.post('/logout', (req, res, next) => {
    try {
    }
    catch (e) {
        console.log(e);
    }
});
exports.authRoute.get('/activate/:link', (req, res, next) => {
    try {
    }
    catch (e) {
        console.log(e);
    }
});
exports.authRoute.get('/refresh', (req, res, next) => {
    try {
    }
    catch (e) {
        console.log(e);
    }
});
