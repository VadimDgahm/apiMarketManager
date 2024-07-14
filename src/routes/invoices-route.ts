import {NextFunction, Response, Router} from 'express';
import {invoicesService} from "../services/invoices-service";
import {AuthenticatedRequest} from '../middlewares/checkActivation-middleware';

export const invoicesRoute = Router({})

invoicesRoute.get('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const invoice = await invoicesService.getInvoicesById(req.params.id);
    res.send(invoice);
  } catch (e) {
    next(e)
  }
});

invoicesRoute.get('/receipt/:briefcase/:order', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const orderInvoice = await invoicesService.getOrderInvoiceById(req.params.briefcase,req.params.order);
    res.send(orderInvoice);
  } catch (e) {
    next(e)
  }
});

invoicesRoute.post('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const createInvoice = await invoicesService.createInvoice(req.body);
    res.send(createInvoice);
  } catch (e) {
    next(e)
  }
});

