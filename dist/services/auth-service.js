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
exports.authService = void 0;
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_service_1 = require("./token-service");
const users_db_repositories_1 = require("../repositories/users-db-repositories");
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const auth_db_repositories_1 = require("../repositories/auth-db-repositories");
exports.authService = {
    registration(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield users_db_repositories_1.UsersRepositories.getUser({ email });
            if (candidate) {
                throw api_error_1.default.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
            }
            const hashPassword = yield bcrypt_1.default.hash(password, 3);
            const activationLink = (0, uuid_1.v4)();
            const body = {
                id: (0, uuid_1.v4)(),
                activationLink,
                email,
                password: hashPassword,
                isActivated: true
            };
            yield auth_db_repositories_1.AuthDBRepositories.registration(body);
            const payload = { id: body.id, email, isActivated: body.isActivated };
            const tokens = token_service_1.tokenService.generationTokens(payload);
            yield token_service_1.tokenService.saveToken(payload.id, tokens.refreshToken);
            // const res = await mailService.sendActivationMail(email, `${process.env.API_URL}/activate/${activationLink}`)
            return Object.assign(Object.assign({}, tokens), { user: Object.assign({}, payload) });
        });
    },
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_db_repositories_1.UsersRepositories.getUser({ email });
            if (!user) {
                throw api_error_1.default.BadRequest(`Пользователь с таким ${email} не найден`);
            }
            const isPassEquals = yield bcrypt_1.default.compare(password, user.password);
            if (!isPassEquals) {
                throw api_error_1.default.BadRequest(`Неверный пароль`);
            }
            const payload = { id: user.id, email, isActivated: user.isActivated };
            const tokens = token_service_1.tokenService.generationTokens(Object.assign({}, payload));
            yield token_service_1.tokenService.saveToken(payload.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: Object.assign({}, payload) });
        });
    },
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield token_service_1.tokenService.removeToken(refreshToken);
            return token;
        });
    },
    activate() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    },
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw api_error_1.default.UnauthorizedError();
            }
            const userData = token_service_1.tokenService.validateRefreshToken(refreshToken);
            if (userData) {
                const user = yield users_db_repositories_1.UsersRepositories.getUser({ id: userData.id });
                const tokenFromDB = yield token_service_1.tokenService.findToken(refreshToken);
                if (!userData || !tokenFromDB) {
                    throw api_error_1.default.UnauthorizedError();
                }
                if (user) {
                    const payload = { id: user.id, email: user.email, isActivated: user.isActivated };
                    yield token_service_1.tokenService.removeToken(payload.id);
                    const tokens = token_service_1.tokenService.generationTokens(payload);
                    yield token_service_1.tokenService.saveToken(payload.id, tokens.refreshToken);
                    return Object.assign(Object.assign({}, tokens), { user: Object.assign({}, payload) });
                }
                else {
                    throw api_error_1.default.BadRequest("Непонятная ошибка");
                }
            }
        });
    }
};
//# sourceMappingURL=auth-service.js.map