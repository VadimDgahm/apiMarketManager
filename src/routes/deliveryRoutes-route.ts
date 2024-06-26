import {NextFunction, Response, Router} from 'express';
import {deliveryRoutesService} from "../services/delivery-routes-service";
import {AuthenticatedRequest} from '../middlewares/checkActivation-middleware';

export const deliveryRoutesRoute = Router({})

deliveryRoutesRoute.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const deliveryRoute = await deliveryRoutesService.getDeliveryRoutes()
    res.send(deliveryRoute)
  } catch (e) {
    next(e)
  }
},);

deliveryRoutesRoute.get('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const deliveryRoute = await deliveryRoutesService.getDeliveryRoutesById(req.params.id)
    res.send(deliveryRoute)
  } catch (e) {
    next(e)
  }
},);

deliveryRoutesRoute.post('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const body = req.body
    const deliveryRoute = await deliveryRoutesService.createDeliveryRoute(body)
    res.send(deliveryRoute)
  } catch (e) {
    next(e)
  }
},);

deliveryRoutesRoute.delete('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const deliveryRoute = await deliveryRoutesService.removeDeliveryRoute(id)

    res.send(deliveryRoute)
  } catch (e) {
    next(e)
  }
},);

deliveryRoutesRoute.put('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const deliveryRouteId = req.params.id
    const body = req.body
    const deliveryRoute = await deliveryRoutesService.updateDeliveryRoute(deliveryRouteId, body)
    res.send(deliveryRoute)
  } catch (e) {
    next(e)
  }
},);

deliveryRoutesRoute.put('/sort/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const body = req.body
    const deliveryRoute = await deliveryRoutesService.sortDeliveryRoute(body)
    res.send(deliveryRoute)
  } catch (e) {
    next(e)
  }
},);