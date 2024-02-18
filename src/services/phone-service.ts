import {clientsRepositories} from '../repositories/clients-db-repositories';
import {QueryResponse} from '../routes/clients-route';
import {v4 as uuidv4} from 'uuid';

import { catalogRepositories } from '../repositories/catalog-db-repositories';
import { addressRepositories } from '../repositories/address-db-repositories';
import { PhoneClient } from './clients-service';
import { phoneRepositories } from '../repositories/phone-db-repositories';

export const phoneService = {
    async createPhone(body:DataRequest, id:string) {
       const phoneObj: PhoneClient = {
        idPhone: uuidv4(),
            ...body
       }
        return await phoneRepositories.createPhone(phoneObj, id)
    },
    async removePhone(idPhone:string, id:string) {
         return await phoneRepositories.removePhone(idPhone, id)
     },
}

type DataRequest = Omit<PhoneClient, "idPhone">