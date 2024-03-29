import {clientsRepositories} from '../repositories/clients-db-repositories';
import {QueryResponse} from '../routes/clients-route';
import {v4 as uuidv4, v4} from 'uuid';
import { getCurrentDate } from '../utils/utils';
import { briefcaseRepositories } from '../repositories/briefcase-db-repositories';

export const briefcaseService = {
    async getBriefcase(userId: string) {
        return await briefcaseRepositories.getBriefcase(userId)
    },
    async getBriefcaseById(briefcaseId: string, userId: string){
        return await briefcaseRepositories.getBriefcaseById(briefcaseId,userId)
    },
    async createBriefcase({name}:RequestCreateBriefcase, userId: string) {
        const body: BriefcaseType = {
            id: v4(),
            name,
            createdDate: getCurrentDate(),
            orders: [],
            userId
        }
        return await briefcaseRepositories.createBriefcase(body)
    },
    async createOrder(idBriefcase: string, data: OrderClientType) {
    
        const body: BriefcaseOrder = {
            orderId: v4(),
            clientName: data.clientName,
            clientId: data.idClient,
            createdDate: getCurrentDate(),
            orderClient: data.orders
            
        }
        return await briefcaseRepositories.createOrder(idBriefcase, body)
    },
    async removeBriefcase (id: string) {
         await briefcaseRepositories.removeBriefcase(id)
    },
    async getPurchases (id: string) {
        await briefcaseRepositories.getPurchases(id)
   },
   async removeOrder (idBriefcase: string, orderId: string) {
    return await briefcaseRepositories.removeOrder(idBriefcase, orderId)
},
}


export type BriefcaseType = {
    name: string
    id: string
    createdDate: string
    orders: BriefcaseOrder[]
    userId: string
}
type RequestCreateBriefcase = Omit<Omit<BriefcaseType, 'id'>, 'createdDate' >

export type OrderType = {
    comments: string;
    name: string;
    positionId: string;
    price: string;
    quantity: string;
    reductionName: string;
  };
  export type OrderClientType = {
    idClient: string;
    clientName: string
    orders: OrderType[];
  };

  export type BriefcaseOrder = 
    {
        clientName: string
        orderId: string,
        clientId: string,
        createdDate: string
        orderClient: OrderType[]
        
    }
  