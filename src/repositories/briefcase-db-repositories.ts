import {briefcaseCollection, clientCollection, deliveryRoutesCollection, invoicesCollection} from './db';
import {
  BriefcaseOrder,
  BriefcaseType,
  OrderDeliveryRouteReqType,
  OrderDeliveryRouteType
} from '../services/briefcase-service';
import {ObjectId} from "mongodb";
import {BriefcasesDeliveryRouteType} from "../services/delivery-routes-service";
import {invoicesService} from "../services/invoices-service";

type GetUserType = {
    id?: string,
    email?: string,
}
export const briefcaseRepositories = {
    async getBriefcase(userId: string) {
        const briefcase = await briefcaseCollection.find({userId}).toArray()
        if(briefcase) {
            return briefcase.reverse()
        }
        else{
            return []
        }
    },
    async getBriefcaseById(briefcaseId: string, userId: string) {
      const resBrief = await briefcaseCollection.aggregate([
        { $match: { id: briefcaseId, userId } },
        {
          $lookup: {
            from: "clients",
            localField: "orders.clientId",
            foreignField: "id",
            as: "orderClientData"
          }
        },
        {
          $project: {
            id: 1,
            name: 1,
            createdDate: 1,
            userId: 1,
            orders: {
              $reverseArray: {
                $map: {
                  input: "$orders",
                  as: "order",
                  in: {
                    $mergeObjects: [
                      "$$order",
                      {
                        dataClient: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: "$orderClientData",
                                as: "client",
                                cond: { $eq: ["$$client.id", "$$order.clientId"] }
                              }
                            },
                            0
                          ]
                        }
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      ]).toArray();

      return resBrief[0];
    },
    async getBriefcaseByIdPurchase(briefcaseId: string, userId: string) {
      const resBrief = await briefcaseCollection.aggregate([
        { $match: { id: briefcaseId, userId } },
        {
          $lookup: {
            from: "clients",
            localField: "orders.clientId",
            foreignField: "id",
            as: "orderClientData"
          }
        },
        {
          $unwind: "$orders"
        },
        {
          $lookup: {
            from: "catalog",
            let: { productIds: "$orders.orderClient.productId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: [ { $toObjectId: "$_id" }, { $map: { input: "$$productIds", as: "pid", in: { $toObjectId: "$$pid" } } } ]
                  }
                }
              },
              { $project: { _id: 0, productId: "$_id", sortValue: 1 } } // Убираем _id, оставляем только productId и sortValue
            ],
            as: "catalogData"
          }
        },
        {
          $project: {
            id: 1,
            name: 1,
            createdDate: 1,
            userId: 1,
            orders: {
              $mergeObjects: [
                "$orders",
                {
                  orderClient: {
                    $map: {
                      input: "$orders.orderClient",
                      as: "clientProduct",
                      in: {
                        $mergeObjects: [
                          "$$clientProduct",
                          {
                            sortValue: {
                              $ifNull: [
                                {
                                  $arrayElemAt: [
                                    {
                                      $map: {
                                        input: {
                                          $filter: {
                                            input: "$catalogData",
                                            as: "catalogItem",
                                            cond: { $eq: [ "$$catalogItem.productId", { $toObjectId: "$$clientProduct.productId" } ] }
                                          }
                                        },
                                        as: "filteredCatalog",
                                        in: "$$filteredCatalog.sortValue"
                                      }
                                    },
                                    0
                                  ]
                                },
                                0
                              ]
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            }
          }
        },
        {
          $group: {
            _id: "$_id",
            orders: { $push: "$orders" },
            id: { $first: "$id" },
            name: { $first: "$name" },
            createdDate: { $first: "$createdDate" },
            userId: { $first: "$userId" }
          }
        }
      ]).toArray();

      return resBrief[0];
    },
    async createBriefcase(order: BriefcaseType): Promise<BriefcaseType>{
       await briefcaseCollection.insertOne(order)
       return order
    },
    async createOrder(idBriefcase: string, body: BriefcaseOrder): Promise<BriefcaseOrder>{
       await briefcaseCollection.updateOne({id: idBriefcase},{$addToSet: {orders: body}})
       await clientCollection.updateOne({id: body.clientId}, { $push : {order: body}})
        return body
     },
     async removeBriefcase(id: string): Promise<void>{
           const res = await briefcaseCollection.deleteOne({id});

           if(res.deletedCount) {
             await invoicesService.deleteInvoicesByBriefcaseId(id);
           }
     },
    async getPurchases(id: string): Promise<void>{
        const res = await briefcaseCollection.findOne({id})
    },
    async removeOrder(idBriefcase: string, orderId: string): Promise<any>{
        const res = await briefcaseCollection.findOne({id: idBriefcase})

        if(res){
            const order = res.orders.find((o) => o.orderId === orderId);

            await invoicesCollection.deleteOne({orderId:order.orderId});

            await clientCollection.updateOne({id: order.clientId}, {$pull: {order: {orderId}}})
             await briefcaseCollection.updateOne(
                { id: idBriefcase },
                { $pull: { orders: { orderId } } }
              );
              if(order) {
                return order
            }
        }
    },
    async changeBriefcase(idBriefcase: string,  body: BriefcaseType, userId: string): Promise<any>{

        return await briefcaseCollection.findOneAndUpdate({id: idBriefcase, userId}, { $set: {name: body.name} })

    },
    async updateOrderClient(idBriefcase: string,  body: BriefcaseType, orderId: string): Promise<any>{
        const briefcase = await briefcaseCollection.findOne({id: idBriefcase})
        const orderIndex = briefcase.orders.findIndex(order => orderId === order.orderId)
        const client = await clientCollection.findOne({id: briefcase.orders[orderIndex].clientId})
        if(briefcase && client){
            const updateArr = briefcase.orders.map(order => order.orderId === orderId ? {...order, ...body} : order)
            const updateArrForCLient  = client.order.map(order => order.orderId === orderId ? {...order, ...body} : order)
            await clientCollection.findOneAndUpdate({id: briefcase.orders[orderIndex].clientId}, {$set: {order: updateArrForCLient}})
            return await briefcaseCollection.findOneAndUpdate({id: idBriefcase}, {$set: {orders: updateArr}})
        }
        return false
    },

  async updateOrderDeliveryRoute(idBriefcase: string, body: OrderDeliveryRouteReqType, orderId: string): Promise<any> {
    const briefcase = await briefcaseCollection.findOne({id: idBriefcase});
    const orderIndex = briefcase.orders.findIndex(order => orderId === order.orderId);
    let time = '';

    // Delete an order in the old delivery route
    if (body.oldDeliveryRouteId) {
      const OldDeliveryRoute = await deliveryRoutesCollection.findOne({_id: new ObjectId(body.oldDeliveryRouteId)});

      if (OldDeliveryRoute) {
        const OldDeliveryRouteIndex = OldDeliveryRoute.briefcases.findIndex(briefcase => briefcase.id === idBriefcase)
        OldDeliveryRoute.briefcases[OldDeliveryRouteIndex].orderIds = OldDeliveryRoute.briefcases[OldDeliveryRouteIndex].orderIds.filter(
          oId => {
            if(oId.orderId !== orderId) {
              return oId;
            } else {
              time = oId.time;
            }
          });

        if (OldDeliveryRoute.briefcases[OldDeliveryRouteIndex].orderIds.length === 0) {
          OldDeliveryRoute.briefcases = OldDeliveryRoute.briefcases.filter(briefcase => briefcase.id !== idBriefcase);
        }

        await deliveryRoutesCollection.findOneAndUpdate({_id: OldDeliveryRoute._id}, {$set: {briefcases: OldDeliveryRoute.briefcases}});
      }
    }

    // Add a new order to the delivery route
    const newDeliveryRoute = await deliveryRoutesCollection.findOne({_id: new ObjectId(body._id)});
    const deliveryRouteIndex = newDeliveryRoute?.briefcases?.findIndex(briefcase => briefcase.id === idBriefcase)

    const newOrderIdObj = {orderId:orderId, sort:Math.floor(Date.now() / 1000), time: time};

    if (isFinite(deliveryRouteIndex) && deliveryRouteIndex !== -1) {
      const isExist = newDeliveryRoute.briefcases[deliveryRouteIndex].orderIds.find(
        item => item.orderId === newOrderIdObj.orderId
      );
      if(!isExist) {
        newDeliveryRoute.briefcases[deliveryRouteIndex].orderIds.push(newOrderIdObj);
      }
    } else if(newDeliveryRoute.briefcases?.length >= 0) {
      newDeliveryRoute.briefcases.push({id: idBriefcase, orderIds: [newOrderIdObj]});
    } else {
      newDeliveryRoute.briefcases = [{id: idBriefcase, orderIds: [newOrderIdObj]}];
    }

    if (briefcase && newDeliveryRoute) {
      briefcase.orders[orderIndex].deliveryRoute = {_id:body._id, name:body.name};

      const resultDR = await deliveryRoutesCollection.findOneAndUpdate({_id: newDeliveryRoute._id}, {$set: newDeliveryRoute});

      if (resultDR) {
        return await briefcaseCollection.findOneAndUpdate({id: idBriefcase}, {$set: {orders: briefcase.orders}});
      }

      return;
    }
  }

}
