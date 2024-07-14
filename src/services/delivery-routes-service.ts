import {deliveryRoutesRepositories} from "../repositories/deliveryRoutes-db-repositories";
import {getCurrentDate} from "../utils/utils";
import {ObjectId} from "mongodb";
import {BriefcaseOrder} from "./briefcase-service";

export const deliveryRoutesService = {
  async getDeliveryRoutes() {
    return await deliveryRoutesRepositories.getDeliveryRoutes()
  },
  async getDeliveryRoutesById(id: string) {
    return await deliveryRoutesRepositories.getDeliveryRoutesById(id)
  },
  async createDeliveryRoute({name}: DeliveryRouteRequest) {
    const body: deliveryRouteType = {
      name,
      createdDate: getCurrentDate(),
      briefcases: [],
    }

    return await deliveryRoutesRepositories.createDeliveryRoute(body)
  },
  async removeDeliveryRoute(id: string) {
    return await deliveryRoutesRepositories.removeDeliveryRoutes(id)
  },
  async updateDeliveryRoute(deliveryRouteId: string, body: DeliveryRouteRequest) {
    return await deliveryRoutesRepositories.updateDeliveryRoute(deliveryRouteId, body)
  },
  async sortDeliveryRoute(body: deliveryRouteType) {
    return await deliveryRoutesRepositories.sortDeliveryRoute(body)
  }
}

export type deliveryRouteType = {
  _id?: ObjectId,
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
