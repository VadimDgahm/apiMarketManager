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
exports.addressService = void 0;
const uuid_1 = require("uuid");
const address_db_repositories_1 = require("../repositories/address-db-repositories");
exports.addressService = {
    createAddress(body, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const addressObj = Object.assign({ idAddress: (0, uuid_1.v4)() }, body);
            return yield address_db_repositories_1.addressRepositories.createAddress(addressObj, id);
        });
    },
    removeAddress(idAddress, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield address_db_repositories_1.addressRepositories.removeAddress(idAddress, id);
        });
    },
    updateAddress(body, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield address_db_repositories_1.addressRepositories.updateAddress(body, id);
        });
    },
};
//# sourceMappingURL=address-service.js.map