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
exports.usersRoute = void 0;
const express_1 = require("express");
const users_db_repositories_1 = require("../repositories/users-db-repositories");
exports.usersRoute = (0, express_1.Router)({});
exports.usersRoute.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield users_db_repositories_1.UsersRepositories.getUsers();
        res.send(users);
    }
    catch (e) {
        next(e);
    }
}));
//# sourceMappingURL=users-route.js.map