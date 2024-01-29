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
exports.authService = void 0;
const db_1 = require("../repositories/db");
exports.authService = {
    registration(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield db_1.UsersCollection.findOne({ email });
            if (candidate) {
                throw new Error(`Пользователь с почтовым адресом ${email} уже существует`);
            }
            else {
                const user = yield db_1.UsersCollection.insertOne({ email, password });
            }
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
