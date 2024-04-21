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
    findClients(title, id, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const userClients = (yield db_1.clientCollection.find({ userId: id }).toArray()).reverse();
            if (userClients) {
                const startIndex = (page - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                const paginatedClients = userClients.slice(startIndex, endIndex);
                if (title) {
                    const finishArr = userClients.filter(el => {
                        const nameMatch = el.name.toLocaleLowerCase().includes(title.toLocaleLowerCase());
                        const phoneMatch = el.phones.some(phone => phone.tel.includes(title));
                        const addressMatch = el.addresses.some(address => address.street.toLocaleLowerCase().includes(title.toLocaleLowerCase()));
                        return nameMatch || phoneMatch || addressMatch;
                    });
                    const paginatedFinishArr = finishArr.slice(startIndex, endIndex);
                    return { clients: paginatedFinishArr, totalCount: finishArr.length };
                }
                else {
                    return {
                        clients: paginatedClients,
                        totalCount: userClients.length
                    };
                }
            }
            else {
                throw new Error('Клиенты не найдены');
            }
        });
    },
    createClient(body) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.clientCollection.insertOne(body);
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
//# sourceMappingURL=clients-db-repositories.js.map