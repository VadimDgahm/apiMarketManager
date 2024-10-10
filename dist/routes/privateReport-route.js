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
exports.privateReportRoute = void 0;
const express_1 = require("express");
const privateReport_service_1 = require("../services/privateReport-service");
exports.privateReportRoute = (0, express_1.Router)({});
// @ts-ignore
exports.privateReportRoute.post('/check-pass', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        res.send(yield privateReport_service_1.privateReportService.checkPrivatePass(req.user.id, password));
    }
    catch (e) {
        next(e);
    }
}));
// @ts-ignore
exports.privateReportRoute.get('/report/:idBriefcase', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workbook = yield privateReport_service_1.privateReportService.createPrivateReport(req.user.id, req.params.idBriefcase, null);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=private_report.xlsx');
        yield workbook.xlsx.write(res);
        res.end();
    }
    catch (e) {
        next(e);
    }
}));
// @ts-ignore
exports.privateReportRoute.post('/select-report', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workbook = yield privateReport_service_1.privateReportService.createPrivateReport(req.user.id, req.body.briefcaseId, req.body.routes);
        const body = req.body;
        console.log(body);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=private_report.xlsx');
        yield workbook.xlsx.write(res);
        res.end();
    }
    catch (e) {
        next(e);
    }
}));
//# sourceMappingURL=privateReport-route.js.map