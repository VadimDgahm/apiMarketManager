"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiErrors extends Error {
    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
    static UnauthorizedError() {
        return new ApiErrors(401, "Пользователь не авторизован");
    }
    static BadRequest(message, errors = []) {
        return new ApiErrors(400, message, errors);
    }
    static NotActivation() {
        return new ApiErrors(403, 'Пользователь не имеет прав доступа к контенту,');
    }
}
exports.default = ApiErrors;
//# sourceMappingURL=api-error.js.map