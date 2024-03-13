"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const token_service_1 = require("../services/token-service");
function authMiddleware(req, res, next) {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return next(api_error_1.default.UnauthorizedError());
        }
        const userData = token_service_1.tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(api_error_1.default.UnauthorizedError());
        }
        req.user = { id: userData.id, email: userData.email, isActivated: userData.isActivated };
        next();
    }
    catch (e) {
        return next(api_error_1.default.UnauthorizedError());
    }
}
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth-middleware.js.map