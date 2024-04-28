import {clientsRepositories} from '../repositories/clients-db-repositories';
import {QueryResponse} from '../routes/clients-route';
import {v4 as uuidv4} from 'uuid';

import { catalogRepositories } from '../repositories/catalog-db-repositories';
import { addressRepositories } from '../repositories/address-db-repositories';

export const addressService = {
    async createAddress(body:DataRequest, id:string) {
       const addressObj: AddressClient = {
            idAddress: uuidv4(),
            ...body
       }
        return await addressRepositories.createAddress(addressObj, id)
    },
    async removeAddress(idAddress:string, id:string) {
         return await addressRepositories.removeAddress(idAddress, id)
     }, 
     async updateAddress(body: AddressClient , id:string) {
        return await addressRepositories.updateAddress(body, id)
    },
}



export type AddressClient = {
    idAddress: string;
    buildingSection?: null | string; // корпус
    city: null | string;
    code?: null | string;
    floor?: null | string; //  этаж
    lobby?: null | string; //  подъзд
    numberApartment?: null | string;
    numberStreet: null | string;
    street: null | string;
  };

  type DataRequest = Omit<AddressClient, 'idAddress'>