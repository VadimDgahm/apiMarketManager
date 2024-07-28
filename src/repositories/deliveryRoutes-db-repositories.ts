import {briefcaseCollection, clientCollection, deliveryRoutesCollection} from './db';
import {DeliveryRouteRequest, DeliveryRouteResponse, deliveryRouteType} from "../services/delivery-routes-service";
import {ObjectId} from "mongodb";
import {BriefcaseOrder} from "../services/briefcase-service";

export const deliveryRoutesRepositories = {
  async getDeliveryRoutes(userId: string) {
    return await deliveryRoutesCollection.find({userId}).toArray();
  },
  async getDeliveryRoutesById(id: string, userId: string) {
    const deliveryRoute = await deliveryRoutesCollection.findOne({_id: new ObjectId(id), userId})
    const result: DeliveryRouteResponse = {
      ...deliveryRoute,
      orders: []
    }

    if (deliveryRoute?.briefcases && deliveryRoute?.briefcases?.length >= 0) {
      for (const deliveryRouteBriefcase of deliveryRoute.briefcases) {
        const briefcase = await briefcaseCollection.findOne({id: deliveryRouteBriefcase.id})
        const orders: BriefcaseOrder[] = [];

        for (const deliveryRouteOrderId of deliveryRouteBriefcase.orderIds) {
          orders.push(...briefcase.orders.filter(order => {
            if(order.orderId === deliveryRouteOrderId.orderId) {
              order.sort = deliveryRouteOrderId.sort;
              order.briefcaseId = deliveryRouteBriefcase.id;
              order.time = deliveryRouteOrderId.time;
              return order;
            }
          }));
        }

        // const orders = briefcase.orders.filter(order => deliveryRouteBriefcase.orderIds.includes(order.orderId));

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

    const sortOrder = (a: BriefcaseOrder, b: BriefcaseOrder) => {
      return (a.sort > b.sort) ? 1 : -1;
    }

    result.orders.sort(sortOrder);

    return result
  },
  async createDeliveryRoute(body: deliveryRouteType) {
    return await deliveryRoutesCollection.insertOne(body)
  },
  async removeDeliveryRoutes(id: string, userId: string) {
    return await deliveryRoutesCollection.deleteOne({_id: new ObjectId(id), userId});
  },
  async updateDeliveryRoute(id: string, body: DeliveryRouteRequest, userId: string) {
    return await deliveryRoutesCollection.findOneAndUpdate({_id: new ObjectId(body._id), userId}, {$set: {name: body.name}})
  },
  async sortDeliveryRoute(body: deliveryRouteType, userId: string) {
    return await deliveryRoutesCollection.findOneAndUpdate({_id: new ObjectId(body._id), userId}, {$set: {briefcases: body.briefcases}})
  }
}
