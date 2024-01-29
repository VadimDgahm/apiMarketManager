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
const db_1 = require("../repositories/db");
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_service_1 = require("./token-service");
exports.authService = {
    registration(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield db_1.UsersCollection.findOne({ email });
            if (candidate) {
                throw new Error(`Пользователь с почтовым адресом ${email} уже существует`);
            }
            const hashPassword = yield bcrypt_1.default.hash(password, 3);
            const activationLink = (0, uuid_1.v4)();
            const body = {
                id: (0, uuid_1.v4)(),
                activationLink,
                email,
                password: hashPassword,
                isActivated: false
            };
            const user = yield db_1.UsersCollection.insertOne(body);
            const payload = { id: body.id, email, isActivated: body.isActivated };
            const tokens = token_service_1.tokenService.generationTokens(payload);
            yield token_service_1.tokenService.saveToken(body.id, tokens.refreshToken);
            // const res = await mailService.sendActivationMail(email, `${process.env.API_URL}/activate/${activationLink}`)
            return Object.assign(Object.assign({}, tokens), { user: Object.assign({}, payload) });
        });
    },
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (e) {
                console.log(e);
            }
        });
    },
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (e) {
                console.log(e);
            }
        });
    },
    activate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (e) {
                console.log(e);
            }
        });
    },
    refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (e) {
                console.log(e);
            }
        });
    }
};
