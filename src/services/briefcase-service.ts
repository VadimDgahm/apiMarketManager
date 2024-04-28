import {clientsRepositories} from '../repositories/clients-db-repositories';
import {QueryResponse} from '../routes/clients-route';
import {v4 as uuidv4, v4} from 'uuid';
import { getCurrentDate } from '../utils/utils';
import { briefcaseRepositories } from '../repositories/briefcase-db-repositories';
import { clientCollection } from '../repositories/db';

export const briefcaseService = {
    async getBriefcase(userId: string) {
        return await briefcaseRepositories.getBriefcase(userId)
    },
    // async getBriefcaseById(briefcaseId: string, userId: string){
    //     const briefcase = await briefcaseRepositories.getBriefcaseById(briefcaseId,userId)
    //    return await briefcase.orders.map(async(order) => {
    //        const client = await clientCollection.findOne({id: order.clientId,userId})
    //         return {...order, dataClient: client}
    //     })
    // },
    async getBriefcaseById(briefcaseId: string, userId: string) {
        const briefcase = await briefcaseRepositories.getBriefcaseById(briefcaseId, userId);
        const processedOrders = await Promise.all(
          briefcase.orders.map(async (order) => {
            const client = await clientCollection.findOne({ id: order.clientId, userId });
            const dataClient = {
                name: client.name,
                status: client.status,
                source: client.source,
                phones: client.phones,
                addresses: client.addresses
            }
            const processedOrder = { ...order, dataClient };
            // Выполните любые другие необходимые операции с обработанным заказом
            return processedOrder;
          })
        );
      
        return { ...briefcase,orders: processedOrders};
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
            address: data.address,
            clientId: data.idClient,
            createdDate: getCurrentDate(),
            orderClient: data.orders,
            dayDelivery: data.dayDelivery,
            timeDelivery: data.timeDelivery,
            addressId: data.addressId
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
    async changeBriefcase (idBriefcase: string, body: BriefcaseType, userId: string) {
    return await briefcaseRepositories.changeBriefcase(idBriefcase, body, userId)
    },

    async updateOrderClient (idBriefcase: string, body: BriefcaseType, orderId: string) {
        return await briefcaseRepositories.updateOrderClient(idBriefcase, body, orderId)
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
    address: string;
    clientName: string
    orders: OrderType[];
    timeDelivery: string,
    dayDelivery: string,
    addressId: string,
  };

  export type BriefcaseOrder = 
    {
        clientName: string
        orderId: string,
        clientId: string,
        address: string,
        createdDate: string
        orderClient: OrderType[]
        timeDelivery:string,
        dayDelivery: string,
        addressId: string        
    }
  