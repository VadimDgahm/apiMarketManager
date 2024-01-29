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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientsRepositories = void 0;
const db_1 = require("./db");
exports.clientsRepositories = {
    findClients(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (title) {
                filter.name = { $regex: title };
            }
            const arr = yield db_1.clientCollection.find(filter).toArray();
            return arr.map(el => {
                const { _id } = el, arg = __rest(el, ["_id"]);
                return arg;
            });
        });
    },
    createClient(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.clientCollection.insertOne(body);
            return body;
        });
    },
    getClientById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.clientCollection.findOne({ id });
            if (client) {
                return client;
            }
            else {
                return undefined;
            }
        });
    },
    updateClient(id, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.clientCollection.updateOne({ id }, { $set: { name: newName } });
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
