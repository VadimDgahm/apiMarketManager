import {NextFunction, Request, Response, Router} from 'express';
import { catalogService } from '../services/catalog-service';
import { authMiddleware } from '../middlewares/auth-middleware';
import { isActivationMiddleware } from '../middlewares/checkActivation-middleware';



export const catalogRoute = Router({})

catalogRoute.get('/',
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users =  await catalogService.getCatalog()
        res.send(users)
    } catch (e) {
        next(e)
    }
},);

catalogRoute.post('/',isActivationMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body
        const users =  await catalogService.createProduct({userId: req.user.id,...body })
        res.send(users)
    } catch (e) {
        next(e)
    }
},);


catalogRoute.delete('/:id',isActivationMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
    
        const users =  await catalogService.removeProduct(id, req.user.id)
        res.send(users)
    } catch (e) {
        next(e)
    }
},);