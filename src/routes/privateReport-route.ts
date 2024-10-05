import {NextFunction, Response, Router} from 'express';
import {AuthenticatedRequest} from '../middlewares/checkActivation-middleware';
import {privateReportService} from "../services/privateReport-service";

export const privateReportRoute = Router({});

// @ts-ignore
privateReportRoute.post('/check-pass', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const {password} = req.body;
        res.send(await privateReportService.checkPrivatePass(req.user.id, password));
    } catch (e) {
        next(e)
    }
},);

// @ts-ignore
privateReportRoute.get('/report/:idBriefcase', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const workbook = await privateReportService.createPrivateReport(req.user.id, req.params.idBriefcase);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=private_report.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (e) {
        next(e)
    }
},);