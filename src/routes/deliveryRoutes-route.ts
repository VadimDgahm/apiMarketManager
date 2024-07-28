import {NextFunction, Response, Router} from 'express';
import {deliveryRoutesService} from "../services/delivery-routes-service";
import {AuthenticatedRequest} from '../middlewares/checkActivation-middleware';

export const deliveryRoutesRoute = Router({})

deliveryRoutesRoute.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const deliveryRoute = await deliveryRoutesService.getDeliveryRoutes(userId);
    res.send(deliveryRoute);
  } catch (e) {
    next(e)
  }
},);

deliveryRoutesRoute.get('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const deliveryRoute = await deliveryRoutesService.getDeliveryRoutesById(req.params.id, userId);
    res.send(deliveryRoute)
  } catch (e) {
    next(e)
  }
},);

deliveryRoutesRoute.post('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const body = req.body
    const userId = req.user.id;
    const deliveryRoute = await deliveryRoutesService.createDeliveryRoute(body, userId);
    res.send(deliveryRoute)
  } catch (e) {
    next(e)
  }
},);

deliveryRoutesRoute.delete('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const deliveryRoute = await deliveryRoutesService.removeDeliveryRoute(id, userId);

    res.send(deliveryRoute)
  } catch (e) {
    next(e)
  }
},);

deliveryRoutesRoute.put('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const deliveryRouteId = req.params.id
    const body = req.body
    const userId = req.user.id;
    const deliveryRoute = await deliveryRoutesService.updateDeliveryRoute(deliveryRouteId, body, userId);
    res.send(deliveryRoute)
  } catch (e) {
    next(e)
  }
},);

deliveryRoutesRoute.put('/sort/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const userId = req.user.id;
    const deliveryRoute = await deliveryRoutesService.sortDeliveryRoute(body, userId);
    res.send(deliveryRoute)
  } catch (e) {
    next(e)
  }
},);