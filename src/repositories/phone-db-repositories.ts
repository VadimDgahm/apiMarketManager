
import {clientCollection, usersCollection} from './db';
import {UserType} from '../services/auth-service';
import { AddressClient } from '../services/address-service';
import { PhoneClient } from '../services/clients-service';


export const phoneRepositories = {
    async createPhone(body: PhoneClient, id: string) {
       
      return  await clientCollection.updateOne({id},{$addToSet: {phones: body}})
    },
    async removePhone(idPhone:string, id:string) {
       
        return  await clientCollection.updateOne({id},{$pull: {phones: {idPhone}}})
      },
}
