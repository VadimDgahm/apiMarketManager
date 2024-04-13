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
const express_1 = __importDefault(require("express"));
const clients_service_1 = require("../services/clients-service");
const clientsRoute = express_1.default.Router();
// @ts-ignore
clientsRoute.get('/', (req, res) => {
    var _a;
    let query = req.query;
    clients_service_1.clientsService.findClients((_a = query.search) === null || _a === void 0 ? void 0 : _a.toString(), req.user.id, +query.page, +query.pageSize).then(clients => res.send(clients));
});
// @ts-ignore
clientsRoute.post('/', (req, res) => {
    clients_service_1.clientsService.createClient(req.body, req.user.id).then(newClient => res.send(newClient));
});
// @ts-ignore
clientsRoute.get('/:id', (req, res) => {
    clients_service_1.clientsService.getClientById(req.params.id, req.user.id).then(client => {
        res.send(client);
    }).catch(e => res.status(404).send({ message: ['not Found', e.messages] }));
});
clientsRoute.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.body;
    const answer = yield clients_service_1.clientsService.updateClient(req.params.id, filter);
    if (answer) {
        res.status(200).send("clients updated");
    }
    else {
        res.status(400).send('client not updated');
    }
}));
clientsRoute.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const answer = yield clients_service_1.clientsService.removeClient(req.params.id.toString());
    answer && res.status(200).send('success');
    !answer && res.status(404).send('not found client');
}));
exports.default = clientsRoute;
//# sourceMappingURL=clients-route.js.map