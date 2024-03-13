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
exports.tokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../repositories/db");
exports.tokenService = {
    generationTokens(payload) {
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_SECRET || 'new-token-secret', { expiresIn: '3h' });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET || 'new-refresh-token-secret', { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken
        };
    },
    saveToken(userId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield db_1.refreshTokenCollection.findOne({ user: userId });
            if (tokenData) {
                yield db_1.refreshTokenCollection.updateOne({ user: userId }, { $set: { refreshToken: refreshToken } });
            }
            const token = yield db_1.refreshTokenCollection.insertOne({ user: userId, refreshToken });
            return token;
        });
    },
    removeToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield db_1.refreshTokenCollection.deleteOne({ user });
            return tokenData;
        });
    },
    findToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield db_1.refreshTokenCollection.findOne({ refreshToken });
            return tokenData;
        });
    },
    validateAccessToken(token) {
        try {
            const userData = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET || 'new-token-secret');
            return userData;
        }
        catch (e) {
            return null;
        }
    },
    validateRefreshToken(token) {
        try {
            const userData = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET || 'new-refresh-token-secret');
            return userData;
        }
        catch (e) {
            return null;
        }
    },
};
//# sourceMappingURL=token-service.js.map