
import {clientCollection, usersCollection} from './db';
import {UserType} from '../services/auth-service';
import { AddressClient } from '../services/address-service';


export const addressRepositories = {
    async createAddress(body: AddressClient, id: string) {
      return  await clientCollection.updateOne({id},{$addToSet: {addresses: body}})
    },
    async removeAddress(idAddress:string, id:string) {   
        return  await clientCollection.updateOne({id},{$pull: {addresses: {idAddress}}})
    },
    async updateAddress(body:AddressClient, id:string) {
      await this.removeAddress(body.idAddress, id)
      return  await this.createAddress(body, id)
        
    },
}
