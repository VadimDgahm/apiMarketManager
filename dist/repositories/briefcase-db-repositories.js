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
exports.briefcaseRepositories = void 0;
const db_1 = require("./db");
exports.briefcaseRepositories = {
    getBriefcase(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const briefcase = yield db_1.briefcaseCollection.find({ userId }).toArray();
            if (briefcase) {
                return briefcase.reverse();
            }
            else {
                return [];
            }
        });
    },
    getBriefcaseById(briefcaseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const briefcase = yield db_1.briefcaseCollection.findOne({ id: briefcaseId, userId });
            briefcase.orders.reverse();
            return briefcase;
        });
    },
    createBriefcase(order) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.briefcaseCollection.insertOne(order);
            return order;
        });
    },
    createOrder(idBriefcase, body) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.briefcaseCollection.updateOne({ id: idBriefcase }, { $addToSet: { orders: body } });
            yield db_1.clientCollection.updateOne({ id: body.clientId }, { $push: { order: body } });
            return body;
        });
    },
    removeBriefcase(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.briefcaseCollection.deleteOne({ id });
        });
    },
    getPurchases(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.briefcaseCollection.findOne({ id });
        });
    },
    removeOrder(idBriefcase, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.briefcaseCollection.findOne({ id: idBriefcase });
            if (res) {
                const order = res.orders.find((o) => o.orderId === orderId);
                yield db_1.clientCollection.updateOne({ id: order.clientId }, { $pull: { order: { orderId } } });
                yield db_1.briefcaseCollection.updateOne({ id: idBriefcase }, { $pull: { orders: { orderId } } });
                if (order) {
                    return order;
                }
            }
        });
    },
    changeBriefcase(idBriefcase, body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.briefcaseCollection.findOneAndUpdate({ id: idBriefcase, userId }, { $set: { name: body.name } });
        });
    },
    updateOrderClient(idBriefcase, body, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const briefcase = yield db_1.briefcaseCollection.findOne({ id: idBriefcase });
            const orderIndex = briefcase.orders.findIndex(order => orderId === order.orderId);
            const client = yield db_1.clientCollection.findOne({ id: briefcase.orders[orderIndex].clientId });
            if (briefcase && client) {
                const updateArr = briefcase.orders.map(order => order.orderId === orderId ? Object.assign(Object.assign({}, order), body) : order);
                const updateArrForCLient = client.order.map(order => order.orderId === orderId ? Object.assign(Object.assign({}, order), body) : order);
                yield db_1.clientCollection.findOneAndUpdate({ id: briefcase.orders[orderIndex].clientId }, { $set: { order: updateArrForCLient } });
                return yield db_1.briefcaseCollection.findOneAndUpdate({ id: idBriefcase }, { $set: { orders: updateArr } });
            }
            return false;
        });
    },
};
//# sourceMappingURL=briefcase-db-repositories.js.map