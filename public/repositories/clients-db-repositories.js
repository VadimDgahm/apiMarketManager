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
exports.clientsRepositories = void 0;
const db_1 = require("./db");
exports.clientsRepositories = {
    findClients(title, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userClients = yield db_1.clientCollection.find({ userId: id }).toArray();
            if (userClients) {
                if (title) {
                    return userClients.filter(el => el.name === title);
                }
                else {
                    return userClients;
                }
            }
            else {
                throw new Error('Клиенты не найдены');
            }
        });
    },
    createClient(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.clientCollection.insertOne(body);
            return body;
        });
    },
    getClientById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userClient = yield db_1.clientCollection.findOne({ id, userId });
            if (userClient) {
                return userClient;
            }
            else {
                return undefined;
            }
        });
    },
    updateClient(id, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.clientCollection.updateOne({ id }, { $set: filter });
            return result.matchedCount === 1;
        });
    },
    removeClient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield db_1.clientCollection.deleteOne({ id });
            return result.deletedCount === 1;
        });
    }
};
