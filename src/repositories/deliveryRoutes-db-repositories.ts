import {briefcaseCollection, clientCollection, deliveryRoutesCollection} from './db';
import {DeliveryRouteRequest, DeliveryRouteResponse, deliveryRouteType} from "../services/delivery-routes-service";
import {ObjectId} from "mongodb";

export const deliveryRoutesRepositories = {
  async getDeliveryRoutes() {
    return await deliveryRoutesCollection.find().toArray()
  },
  async getDeliveryRoutesById(id: string) {
    const deliveryRoute = await deliveryRoutesCollection.findOne({_id: new ObjectId(id)})
    const result: DeliveryRouteResponse = {
      ...deliveryRoute,
      orders: []
    }

    if (deliveryRoute?.briefcases && deliveryRoute?.briefcases?.length >= 0) {
      for (const deliveryRouteBriefcase of deliveryRoute.briefcases) {
        const briefcase = await briefcaseCollection.findOne({id: deliveryRouteBriefcase.id})
        const orders = briefcase.orders.filter(order => deliveryRouteBriefcase.orderIds.includes(order.orderId));

        for (const order of orders) {
          const client = await clientCollection.findOne({id: order.clientId});
          order.dataClient = {
            name: client.name,
            status: client.status,
            source: client.source,
            phones: client.phones,
            addresses: client.addresses
          };
        }

        result.orders.push(...orders);
      }
    }

    return result
  },
  async createDeliveryRoute(body: deliveryRouteType) {
    return await deliveryRoutesCollection.insertOne(body)
  },
  async removeDeliveryRoutes(id: string) {
    return await deliveryRoutesCollection.deleteOne({_id: new ObjectId(id)})
  },
  async updateDeliveryRoute(id: string, body: DeliveryRouteRequest) {
    return await deliveryRoutesCollection.findOneAndUpdate({_id: new ObjectId(body._id)}, {$set: {name: body.name}})
  }
}
