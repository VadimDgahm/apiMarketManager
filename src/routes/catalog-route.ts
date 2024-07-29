import {NextFunction, Request, Response, Router} from 'express';
import { catalogService } from '../services/catalog-service';
import { authMiddleware } from '../middlewares/auth-middleware';
import {AuthenticatedRequest, isActivationMiddleware} from '../middlewares/checkActivation-middleware';



export const catalogRoute = Router({})

// @ts-ignore
catalogRoute.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const users =  await catalogService.getCatalog(userId);
        res.send(users)
    } catch (e) {
        next(e)
    }
},);
// @ts-ignore
catalogRoute.post('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const body = req.body
        const users =  await catalogService.createProduct({userId: req.user.id,...body })
        res.send(users)
    } catch (e) {
        next(e)
    }
},);

// @ts-ignore
catalogRoute.delete('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
    
        const users =  await catalogService.removeProduct(id, req.user.id)
        res.send(users)
    } catch (e) {
        next(e)
    }
},);

catalogRoute.put('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.id
        const body = req.body
        const users =  await catalogService.changeProduct(productId, req.user.id, body)
        res.send(users)
    } catch (e) {
        next(e)
    }
},);