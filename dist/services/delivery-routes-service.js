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
exports.deliveryRoutesService = void 0;
const deliveryRoutes_db_repositories_1 = require("../repositories/deliveryRoutes-db-repositories");
const utils_1 = require("../utils/utils");
exports.deliveryRoutesService = {
    getDeliveryRoutes(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield deliveryRoutes_db_repositories_1.deliveryRoutesRepositories.getDeliveryRoutes(userId);
        });
    },
    getDeliveryRoutesById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield deliveryRoutes_db_repositories_1.deliveryRoutesRepositories.getDeliveryRoutesById(id, userId);
        });
    },
    createDeliveryRoute({ name }, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                userId,
                name,
                createdDate: (0, utils_1.getCurrentDate)(),
                briefcases: [],
            };
            return yield deliveryRoutes_db_repositories_1.deliveryRoutesRepositories.createDeliveryRoute(body);
        });
    },
    removeDeliveryRoute(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield deliveryRoutes_db_repositories_1.deliveryRoutesRepositories.removeDeliveryRoutes(id, userId);
        });
    },
    updateDeliveryRoute(deliveryRouteId, body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield deliveryRoutes_db_repositories_1.deliveryRoutesRepositories.updateDeliveryRoute(deliveryRouteId, body, userId);
        });
    },
    sortDeliveryRoute(body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield deliveryRoutes_db_repositories_1.deliveryRoutesRepositories.sortDeliveryRoute(body, userId);
        });
    }
};
//# sourceMappingURL=delivery-routes-service.js.map