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
exports.briefcaseService = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("../utils/utils");
const briefcase_db_repositories_1 = require("../repositories/briefcase-db-repositories");
exports.briefcaseService = {
    getBriefcase(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield briefcase_db_repositories_1.briefcaseRepositories.getBriefcase(userId);
        });
    },
    // async getBriefcaseById(briefcaseId: string, userId: string){
    //     const briefcase = await briefcaseRepositories.getBriefcaseById(briefcaseId,userId)
    //    return await briefcase.orders.map(async(order) => {
    //        const client = await clientCollection.findOne({id: order.clientId,userId})
    //         return {...order, dataClient: client}
    //     })
    // },
    getBriefcaseById(briefcaseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield briefcase_db_repositories_1.briefcaseRepositories.getBriefcaseById(briefcaseId, userId);
        });
    },
    getBriefcaseByIdPurchase(briefcaseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield briefcase_db_repositories_1.briefcaseRepositories.getBriefcaseByIdPurchase(briefcaseId, userId);
        });
    },
    createBriefcase({ name }, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                id: (0, uuid_1.v4)(),
                name,
                createdDate: (0, utils_1.getCurrentDate)(),
                orders: [],
                userId
            };
            return yield briefcase_db_repositories_1.briefcaseRepositories.createBriefcase(body);
        });
    },
    createOrder(idBriefcase, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                orderId: (0, uuid_1.v4)(),
                clientName: data.clientName,
                address: data.address,
                clientId: data.idClient,
                createdDate: (0, utils_1.getCurrentDate)(),
                orderClient: data.orders,
                dayDelivery: data.dayDelivery,
                timeDelivery: data.timeDelivery,
                addressId: data.addressId,
                deliveryRoute: null
            };
            return yield briefcase_db_repositories_1.briefcaseRepositories.createOrder(idBriefcase, body);
        });
    },
    removeBriefcase(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield briefcase_db_repositories_1.briefcaseRepositories.removeBriefcase(id);
        });
    },
    getPurchases(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield briefcase_db_repositories_1.briefcaseRepositories.getPurchases(id);
        });
    },
    removeOrder(idBriefcase, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield briefcase_db_repositories_1.briefcaseRepositories.removeOrder(idBriefcase, orderId);
        });
    },
    changeBriefcase(idBriefcase, body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield briefcase_db_repositories_1.briefcaseRepositories.changeBriefcase(idBriefcase, body, userId);
        });
    },
    updateOrderClient(idBriefcase, body, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield briefcase_db_repositories_1.briefcaseRepositories.updateOrderClient(idBriefcase, body, orderId);
        });
    },
    updateOrderDeliveryRoute(idBriefcase, body, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield briefcase_db_repositories_1.briefcaseRepositories.updateOrderDeliveryRoute(idBriefcase, body, orderId);
        });
    },
};
//# sourceMappingURL=briefcase-service.js.map