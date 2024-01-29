"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoute = void 0;
const express_1 = require("express");
exports.usersRoute = (0, express_1.Router)({});
exports.usersRoute.get('/', (req, res, next) => {
    try {
        res.json('All ok');
    }
    catch (e) {
        console.log(e);
    }
});
