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
exports.clientsService = void 0;
const clients_db_repositories_1 = require("../repositories/clients-db-repositories");
const uuid_1 = require("uuid");
const utils_1 = require("../utils/utils");
exports.clientsService = {
    findClients(title, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield clients_db_repositories_1.clientsRepositories.findClients(title, id);
        });
    },
    createClient({ name, status = 'новый', source = 'неопределен', phones, addresses, comments }, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = (0, utils_1.getCurrentDate)();
            const body = {
                id: (0, uuid_1.v4)(),
                name,
                status,
                source,
                phones,
                addresses,
                comments,
                dateLastOrder: '',
                createdDate: currentDate,
                userId
            };
            const result = yield clients_db_repositories_1.clientsRepositories.createClient(body);
            return body;
        });
    },
    getClientById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = clients_db_repositories_1.clientsRepositories.getClientById(id, userId);
            return client;
        });
    },
    updateClient(id, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield clients_db_repositories_1.clientsRepositories.updateClient(id, filter);
        });
    },
    removeClient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield clients_db_repositories_1.clientsRepositories.removeClient(id);
        });
    }
};
