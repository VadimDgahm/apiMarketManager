"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentDate = void 0;
const getCurrentDate = () => {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    let day = ('0' + currentDate.getDate()).slice(-2);
    let normalizedDate = `${day}.${month}.${year}`;
    return normalizedDate;
};
exports.getCurrentDate = getCurrentDate;
//# sourceMappingURL=utils.js.map