"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientsRepositories = void 0;
const clients = [{ id: 0, name: 'Vadim' }, { id: 1, name: "Gena" }, { id: 3, name: 'Alina' },];
exports.clientsRepositories = {
    findClients() {
        return clients;
    },
    createClient(name) {
        const body = {
            id: +(new Date()),
            name
        };
        clients.push(body);
        return body;
    },
    getClientById(id) {
        const client = clients.find(el => el.id === id);
        if (client) {
            return client;
        }
        else {
            return undefined;
        }
    },
    updateClient(id, newName) {
        const client = clients.find(el => el.id === id);
        if (client) {
            client.name = newName;
            return true;
        }
        else
            return false;
    },
    removeClient(id) {
        for (let i = 0; i < clients.length; i++) {
            if (clients[i].id === id) {
                clients.splice(i, 1);
                return true;
            }
        }
        return false;
    }
};
