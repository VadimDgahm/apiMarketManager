import {NextFunction, Response, Router} from 'express';
import {invoicesService} from "../services/invoices-service";
import {AuthenticatedRequest} from '../middlewares/checkActivation-middleware';

export const invoicesRoute = Router({})

invoicesRoute.get('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const invoice = await invoicesService.getInvoicesById(req.params.id, userId);
    res.send(invoice);
  } catch (e) {
    next(e)
  }
});

invoicesRoute.get('/receipt/:briefcase/:order', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const orderInvoice = await invoicesService.getOrderInvoiceById(req.params.briefcase,req.params.order, userId);
    res.send(orderInvoice);
  } catch (e) {
    next(e)
  }
});

invoicesRoute.post('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const createInvoice = await invoicesService.createInvoice(req.body, userId);
    res.send(createInvoice);
  } catch (e) {
    next(e)
  }
});

invoicesRoute.get('/totalweight/:briefcase', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const totalWeight = await invoicesService.getTotalWeightByBriefcaseId(req.params.briefcase);
    res.send(totalWeight);
  } catch (e) {
    next(e)
  }
});

