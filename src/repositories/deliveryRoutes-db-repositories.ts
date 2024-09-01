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
        const resBrief = await briefcaseCollection.aggregate([
          { $match: { id: deliveryRouteBriefcase.id, userId } },
          {
            $project: {
              id: 1,
              name: 1,
              createdDate: 1,
              orders: {
                $filter: {
                  input: "$orders",
                  as: "order",
                  cond: { $eq: ["$$order.deliveryRoute._id", id] }
                }
              }
            }
          },
          {
            $unwind: "$orders"
          },
          {
            $lookup: {
              from: "clients",
              localField: "orders.clientId",
              foreignField: "id",
              as: "orderClientData"
            }
          },
          {
            $unwind: {
              path: "$orderClientData",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $group: {
              _id: "$_id",
              id: { $first: "$id" },
              orders: {
                $push: {
                  $mergeObjects: [
                    "$orders",
                    {
                      dataClient: {
                        name: "$orderClientData.name",
                        status: "$orderClientData.status",
                        source: "$orderClientData.source",
                        phones: "$orderClientData.phones",
                        addresses: "$orderClientData.addresses"
                      }
                    }
                  ]
                }
              }
            }
          }
        ]).toArray();

        const briefcase = resBrief[0];
        const orderMap:Map<string, BriefcaseOrder> = new Map();

        for (const order of briefcase.orders) {
          orderMap.set(order.orderId, order);
        }

        for (const deliveryRouteOrderId of deliveryRouteBriefcase.orderIds) {
          const order = orderMap.get(deliveryRouteOrderId.orderId);

          if (order) {
            result.drTotalAmount += order.finalTotalAmount ?? 0

            order.sort = deliveryRouteOrderId.sort;
            order.briefcaseId = deliveryRouteBriefcase.id;
            order.time = deliveryRouteOrderId.time;
          }
        }

        result.orders.push(...briefcase.orders);
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
