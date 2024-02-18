import {NextFunction, Request, Response, Router} from 'express';
import {UsersRepositories} from '../repositories/users-db-repositories';
import { addressService } from '../services/address-service';
import { phoneService } from '../services/phone-service';



export const phoneRoute = Router({})
phoneRoute.post('/:id',
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body
        const idClient = req.params.id
        if(idClient){
            const phone =  await phoneService.createPhone(body, idClient )
            res.send(phone)
        }
       
    } catch (e) {
        next(e)
    }
},);

phoneRoute.delete('/:id',
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body
        const idClient = req.params.id
        if(idClient){
            const phone =  await phoneService.removePhone(body.idPhone, idClient )
            res.send(phone)
        }
       
    } catch (e) {
        next(e)
    }
},);