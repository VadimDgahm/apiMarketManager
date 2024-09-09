import {clientsRepositories} from '../repositories/clients-db-repositories';
import {QueryResponse} from '../routes/clients-route';
import {v4 as uuidv4, v4} from 'uuid';
import { getCurrentDate } from '../utils/utils';
import { briefcaseRepositories } from '../repositories/briefcase-db-repositories';
import { clientCollection } from '../repositories/db';
import {OrderItemsResponse} from "./invoices-service";

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
        return await briefcaseRepositories.getBriefcaseById(briefcaseId, userId);
    },
    async getBriefcaseByIdPurchase(briefcaseId: string, userId: string) {
      return await briefcaseRepositories.getBriefcaseByIdPurchase(briefcaseId, userId);
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
            addressId: data.addressId,
            deliveryRoute: null
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
    async updateOrderDeliveryRoute (idBriefcase: string, body: OrderDeliveryRouteReqType, orderId: string) {
      return await briefcaseRepositories.updateOrderDeliveryRoute(idBriefcase, body, orderId)
    },
}

export type BriefcaseType = {
    name: string
    id: string
    createdDate: string
    orders: BriefcaseOrder[]
    userId: string
    tt?: number
}
type RequestCreateBriefcase = Omit<Omit<BriefcaseType, 'id'>, 'createdDate' >

export type OrderType = {
    productId: string;
    comments: string;
    name: string;
    positionId: string;
    price: string;
    quantity: string;
    reductionName: string;
    isGift: boolean;
  };
export type OrderDeliveryRouteType = {
   _id: string;
   name: string;
};

export type OrderDeliveryRouteReqType = {
  oldDeliveryRouteId: string
} & OrderDeliveryRouteType;

export type OrderClientType = {
  idClient: string;
  address: string;
  clientName: string
  orders: OrderType[];
  timeDelivery: string,
  dayDelivery: string,
  addressId: string,
};

export type BriefcaseOrder = {
  clientName: string,
  orderId: string,
  clientId: string,
  address: string,
  createdDate: string
  orderClient: OrderType[]
  timeDelivery: string,
  dayDelivery: string,
  addressId: string,
  deliveryRoute: OrderDeliveryRouteType | null,
  dataClient?: object,
  sort?: number,
  briefcaseId? : string,
  time?: string,
  invoiceOrderItems?: OrderItemsResponse[],
  totalAmount?: number;
  discount?: number;
  priceDelivery?: number;
  finalTotalAmount?: number;
  markOrder?: boolean;
  userId?: string;
}
  