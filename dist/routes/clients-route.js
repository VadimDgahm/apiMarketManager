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
exports.clientsRoute = void 0;
const express_1 = require("express");
const clients_service_1 = require("../services/clients-service");
exports.clientsRoute = (0, express_1.Router)({});
exports.clientsRoute.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let query = req.query;
    let clients = yield clients_service_1.clientsService.findClients((_a = query.name) === null || _a === void 0 ? void 0 : _a.toString());
    res.send(clients);
}));
exports.clientsRoute.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newClient = yield clients_service_1.clientsService.createClient(req.body);
    res.send(newClient);
}));
exports.clientsRoute.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield clients_service_1.clientsService.getClientById(req.params.id);
    if (client) {
        res.send(client);
    }
    else {
        res.status(404).send('not Find');
    }
}));
exports.clientsRoute.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const answer = yield clients_service_1.clientsService.updateClient(req.params.id, name);
    if (answer) {
        res.status(200).send("clients updated");
    }
    else {
        res.status(400).send('client not updated');
    }
}));
exports.clientsRoute.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const answer = yield clients_service_1.clientsService.removeClient(req.params.id.toString());
    answer && res.status(200).send('success');
    !answer && res.status(404).send('not found client');
}));
