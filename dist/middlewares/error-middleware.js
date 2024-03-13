"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_error_1 = __importDefault(require("../exceptions/api-error"));
function errorMiddleware(err, req, res, next) {
    console.log(err);
    if (err instanceof api_error_1.default) {
        return res.status(err.status).send({ message: err.message, errors: err.errors });
    }
    return res.status(500).send({ message: "Непредвиденная ошибка" });
}
exports.default = errorMiddleware;
//# sourceMappingURL=error-middleware.js.map