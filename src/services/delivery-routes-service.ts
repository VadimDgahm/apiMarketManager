import {deliveryRoutesRepositories} from "../repositories/deliveryRoutes-db-repositories";
import {getCurrentDate} from "../utils/utils";
import {ObjectId} from "mongodb";
import {BriefcaseOrder} from "./briefcase-service";

export const deliveryRoutesService = {
  async getDeliveryRoutes(userId: string) {
    return await deliveryRoutesRepositories.getDeliveryRoutes(userId);
  },
  async getDeliveryRoutesById(id: string, userId: string) {
    return await deliveryRoutesRepositories.getDeliveryRoutesById(id, userId);
  },
  async createDeliveryRoute({name}: DeliveryRouteRequest, userId: string) {
    const body: deliveryRouteType = {
      userId,
      name,
      createdDate: getCurrentDate(),
      briefcases: [],
    }

    return await deliveryRoutesRepositories.createDeliveryRoute(body)
  },
  async removeDeliveryRoute(id: string, userId: string) {
    return await deliveryRoutesRepositories.removeDeliveryRoutes(id, userId);
  },
  async updateDeliveryRoute(deliveryRouteId: string, body: DeliveryRouteRequest, userId: string) {
    return await deliveryRoutesRepositories.updateDeliveryRoute(deliveryRouteId, body, userId);
  },
  async sortDeliveryRoute(body: deliveryRouteType, userId:string) {
    return await deliveryRoutesRepositories.sortDeliveryRoute(body, userId);
  }
}

export type deliveryRouteType = {
  _id?: ObjectId,
  userId: string,
  name: string,
  createdDate: string,
  briefcases: BriefcasesDeliveryRouteType[],
}

export type BriefcasesDeliveryRouteType = {
  id: string,
  orderIds: {orderId: string, sort: number, time: string}[]
}

export type DeliveryRouteRequest = {
  _id?: string,
  name: string
}

export type DeliveryRouteResponse = {
  drTotalAmount?: number;
  orders: BriefcaseOrder[]
} & deliveryRouteType
