import {
  briefcaseCollection,
  catalogCollection,
  clientCollection,
  deliveryRoutesCollection,
  invoicesCollection
} from './db';
import {DeliveryRouteResponse} from "../services/delivery-routes-service";
import {Filter, ObjectId} from "mongodb";
import {BriefcaseOrder} from "../services/briefcase-service";
import {InvoiceType, InvoiceTypeRes} from "../services/invoices-service";

export const invoicesRepositories = {
  async getInvoicesById(id: string, userId: string) {
    const deliveryRoute = await deliveryRoutesCollection.findOne({_id: new ObjectId(id), userId});
    const result: DeliveryRouteResponse = {
      ...deliveryRoute,
      orders: [],
      drTotalAmount: 0
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

  async createInvoice(body:InvoiceType) {
    const query = { orderId: body.orderId };
    const update = { $set: body};
    const options = { upsert: true };

    return await invoicesCollection.updateOne(query, update, options);
  },

  async getOrderInvoiceById(briefcaseId: string, orderId: string, userId: string) {
    const briefcase = await briefcaseCollection.aggregate([
      { $match: { id:briefcaseId, userId } },
      {
        $project: {
          orders: {
            $filter: {
              input: "$orders",
              as: "order",
              cond: { $eq: ["$$order.orderId", orderId] }
            }
          }
        }
      }
    ]).toArray();

    const order = briefcase[0].orders[0] ?? null;

    if(order) {
      order.userId = userId;
    }

    return order;
  },

  async getDR(drId: string) {
    return await deliveryRoutesCollection.findOne({_id: new ObjectId(drId)});
  },

  async deleteManyInvoices(query: Filter<InvoiceTypeRes>) {
    return await invoicesCollection.deleteMany(query);
  },

  async getInvoicesByBriefcase(briefcaseId: string) {
    return invoicesCollection.find({briefcaseId});
  }
}
