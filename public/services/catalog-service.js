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
    getCatalog() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield catalog_db_repositories_1.catalogRepositories.getCatalog();
        });
    },
    createProduct({ name, price, type, userId, view, reductionName }) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                id: (0, uuid_1.v4)(),
                name,
                price,
                type,
                view,
                userId,
                reductionName
            };
            return yield catalog_db_repositories_1.catalogRepositories.createProduct(body);
        });
    },
    removeProduct(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield catalog_db_repositories_1.catalogRepositories.removeProduct(id, userId);
        });
    }
};
