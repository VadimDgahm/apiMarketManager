import {NextFunction, Request, Response, Router} from 'express';
import {UsersRepositories} from '../repositories/users-db-repositories';
import { addressService } from '../services/address-service';



export const addressRoute = Router({})
addressRoute.post('/:id',
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body
        const idClient = req.params.id
        if(idClient){
            const address =  await addressService.createAddress(body, idClient )
            res.send(address)
        }
       
    } catch (e) {
        next(e)
    }
},);

addressRoute.delete('/:id',
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body
        const idClient = req.params.id
        if(idClient){
            const address =  await addressService.removeAddress(body.idAddress, idClient )
            res.send(address)
        }
       
    } catch (e) {
        next(e)
    }
},);

addressRoute.put('/:id',
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body
        const idClient = req.params.id
        if(idClient){
            const address =  await addressService.updateAddress(body, idClient )
            res.send(address)
        }
       
    } catch (e) {
        next(e)
    }
},);