"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isActivationMiddleware = void 0;
const api_error_1 = __importDefault(require("../exceptions/api-error"));
function isActivationMiddleware(req, res, next) {
    try {
        const isActivated = req.user.isActivated;
        if (!isActivated) {
            return next(api_error_1.default.NotActivation());
        }
        else {
            next();
        }
    }
    catch (e) {
        return next(api_error_1.default.UnauthorizedError());
    }
}
exports.isActivationMiddleware = isActivationMiddleware;
//# sourceMappingURL=checkActivation-middleware.js.map