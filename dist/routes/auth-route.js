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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = require("express");
const auth_service_1 = require("../services/auth-service");
const express_validator_1 = require("express-validator");
const api_error_1 = __importDefault(require("../exceptions/api-error"));
exports.authRoute = (0, express_1.Router)({});
exports.authRoute.post('/registration', (0, express_validator_1.body)('password').isLength({ min: 3, max: 32 }).isString(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return next(api_error_1.default.BadRequest("Ошибка при валидации", errors.array()));
        }
        const { email, password } = req.body;
        const userData = yield auth_service_1.authService.registration(email, password);
        return res.send(userData);
    }
    catch (e) {
        next(e);
    }
}));
exports.authRoute.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userData = yield auth_service_1.authService.login(email, password);
        res.cookie('accessToken', userData === null || userData === void 0 ? void 0 : userData.accessToken, { maxAge: 30 * 60 * 1000, httpOnly: true });
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        return res.send(userData);
    }
    catch (e) {
        next(e);
    }
}));
exports.authRoute.post('/logout', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.cookies;
        const token = yield auth_service_1.authService.logout(refreshToken);
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        return res.send(token);
    }
    catch (e) {
        next(e);
    }
}));
exports.authRoute.get('/activate/:link', (req, res, next) => {
    try {
    }
    catch (e) {
        next(e);
    }
});
exports.authRoute.get('/refresh', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.cookies;
        const userData = yield auth_service_1.authService.refresh(refreshToken);
        res.cookie('accessToken', userData === null || userData === void 0 ? void 0 : userData.accessToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        return res.send(userData);
    }
    catch (e) {
        next(e);
    }
}));
exports.authRoute.get('/me', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            res.send();
        }
    }
    catch (e) {
        next(e);
    }
}));
