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
exports.catalogService = void 0;
const uuid_1 = require("uuid");
const catalog_db_repositories_1 = require("../repositories/catalog-db-repositories");
exports.catalogService = {
    getCatalog(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield catalog_db_repositories_1.catalogRepositories.getCatalog(userId);
        });
    },
    createProduct({ name, type, userId, view, reductionName, price, sortValue, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                id: (0, uuid_1.v4)(),
                name,
                type,
                view,
                userId,
                reductionName,
                price,
                sortValue,
            };
            return yield catalog_db_repositories_1.catalogRepositories.createProduct(body);
        });
    },
    removeProduct(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield catalog_db_repositories_1.catalogRepositories.removeProduct(id, userId);
        });
    },
    changeProduct(productId, userId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield catalog_db_repositories_1.catalogRepositories.changeProduct(productId, userId, body);
        });
    },
};
//# sourceMappingURL=catalog-service.js.map