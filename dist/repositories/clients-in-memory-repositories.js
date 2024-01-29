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
const clients = [{ id: 0, name: 'Vadim' }, { id: 1, name: "Gena" }, { id: 3, name: 'Alina' },];
exports.clientsRepositories = {
    findClients() {
        return __awaiter(this, void 0, void 0, function* () {
            return clients;
        });
    },
    createClient(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                id: +(new Date()),
                name
            };
            clients.push(body);
            return body;
        });
    },
    getClientById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = clients.find(el => el.id === id);
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
            const client = clients.find(el => el.id === id);
            if (client) {
                client.name = newName;
                return true;
            }
            else
                return false;
        });
    },
    removeClient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < clients.length; i++) {
                if (clients[i].id === id) {
                    clients.splice(i, 1);
                    return true;
                }
            }
            return false;
        });
    }
};
