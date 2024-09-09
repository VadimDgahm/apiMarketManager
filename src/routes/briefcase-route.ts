import {Request, Response, Router} from "express";
import { briefcaseService } from "../services/briefcase-service";
import {AuthenticatedRequest} from '../middlewares/checkActivation-middleware';

export const briefcaseRoute= Router({})

// @ts-ignore
briefcaseRoute.get('/', async (req: AuthenticatedRequest, res: Response) => {
    let briefcases = await briefcaseService.getBriefcase(req.user.id)
    res.send(briefcases)
})

// @ts-ignore
briefcaseRoute.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
    const briefcase = await briefcaseService.getBriefcaseById(req.params.id , req.user.id)

    if (briefcase) {
        res.send(briefcase)
    } else {
        res.status(404).send('not Found')
    }
})

// @ts-ignore
briefcaseRoute.get('/purchase/:id', async (req: AuthenticatedRequest, res: Response) => {
    const briefcase = await briefcaseService.getBriefcaseByIdPurchase(req.params.id , req.user.id)

    if (briefcase) {
        res.send(briefcase)
    } else {
        res.status(404).send('not Found')
    }
})
briefcaseRoute.post('/:id', async (req: Request, res: Response) => {

    const idBriefcase = req.params.id
    const body = req.body
    if(idBriefcase){
        const order = await briefcaseService.createOrder(idBriefcase, body)
       res.send(order)
    }
    else  res.status(500).send('not remove')
})

// @ts-ignore
briefcaseRoute.post('/', async (req: AuthenticatedRequest, res: Response) => {
    let briefcaseUser = await briefcaseService.createBriefcase(req.body, req.user.id)
    res.send(briefcaseUser)
})

briefcaseRoute.delete('/:id', async (req: Request, res: Response, next) => {
    let id = req.params.id
    if(id) {
     await briefcaseService.removeBriefcase(id)
    res.send({message: `${id} успешно удален`})
 
    }
    else{
        next(`${id} не удален по непонятным причинам`)
    }
   
})


briefcaseRoute.get('/:id/purchases', async (req: Request, res: Response) => {
    const idBriefcase = req.params.id
    if(idBriefcase){
        const purchases = await briefcaseService.getPurchases(idBriefcase)
       res.send(purchases)
    }
    else  res.status(500).send('not remove')
})


briefcaseRoute.delete('/:id/orders/:orderId', async (req: Request, res: Response) => {
    const idBriefcase = req.params.id
    const orderId = req.params.orderId
    if(idBriefcase && orderId){
        const order = await briefcaseService.removeOrder(idBriefcase, orderId)
       res.send(order)
    }
    else  res.status(500).send('not remove')
})
briefcaseRoute.put('/:id/orders/:orderId', async (req: Request, res: Response) => {
    const idBriefcase = req.params.id
    const orderId = req.params.orderId
    const body = req.body
    if(idBriefcase && orderId){
        const order = await briefcaseService.updateOrderClient(idBriefcase, body,orderId)
       res.send(order)
    }
    else  res.status(500).send('not remove')
})

briefcaseRoute.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
    const idBriefcase = req.params.id
    const body = req.body
    if(idBriefcase){
        const briefcase = await briefcaseService.changeBriefcase(idBriefcase, body, req.user.id)
       res.send(briefcase)
    }
    else  res.status(500).send('not change')
})

briefcaseRoute.put('/:id/orders/:orderId/deliveryRoute', async (req: Request, res: Response) => {
    const idBriefcase = req.params.id
    const orderId = req.params.orderId
    const body = req.body

    if(idBriefcase && orderId){
        const order = await briefcaseService.updateOrderDeliveryRoute(idBriefcase, body, orderId)
        res.send(order)
    }
    else  res.status(500).send('not change')
})