import {invoicesRepositories} from "../repositories/invoices-db-repositories";
import {briefcaseCollection, catalogCollection} from "../repositories/db";
import {ObjectId} from "mongodb";

export const invoicesService = {
  async getInvoicesById(id: string, userId: string) {
    return await invoicesRepositories.getInvoicesById(id, userId);
  },

  async getOrderInvoiceById(briefcaseId: string, orderId: string, userId: string) {
    return await invoicesRepositories.getOrderInvoiceById(briefcaseId, orderId, userId);
  },

  async createInvoice(body: InvoiceType, userId: string) {
    const invoiceOrderItems: OrderItemsResponse[] = [];
    let totalAmount = 0;


    for (const item of body.orderItems) {
      const product = await catalogCollection.findOne({_id: new ObjectId(item.productId)});
      let amount = 0;

      if (!item.isGift) {
        amount = +(product.price * item.weight).toFixed(2);
      }

      totalAmount += amount;

      invoiceOrderItems.push({
        ...item,
        productPrice: product.price,
        name: product.name,
        amount: amount,
        units: item.units,
        comments: item.comments
      });

    }

    totalAmount = +(totalAmount + body.priceDelivery).toFixed(2);
    const finalTotalAmount = +(totalAmount * (1 - body.discount / 100)).toFixed(2);

    const updatedFields = {
      "orders.$[order].invoiceOrderItems": invoiceOrderItems,
      "orders.$[order].discount": body.discount,
      "orders.$[order].priceDelivery": body.priceDelivery,
      "orders.$[order].markOrder": body.markOrder,
      "orders.$[order].totalAmount": totalAmount,
      "orders.$[order].finalTotalAmount": finalTotalAmount
    };

    const result = await briefcaseCollection.updateOne(
      { "orders.orderId": body.orderId },
      { $set: updatedFields },
      {
        arrayFilters: [{ "order.orderId": body.orderId }],
        upsert: false
      }
    );

    return result;
  },

  async deleteInvoicesByBriefcaseId(briefcaseId: string) {
    return await invoicesRepositories.deleteManyInvoices({briefcaseId});
  },

  async getTotalWeightByBriefcaseId(briefcaseId: string) {
    const brief = await briefcaseCollection.aggregate([
      { $match: { id: briefcaseId } },
      { $unwind: "$orders" },
      {
        $match: { "orders.invoiceOrderItems": { $exists: true, $ne: [] } }
      },
      {
        $lookup: {
          from: "catalog",
          let: { productId: "$orders.invoiceOrderItems.productId" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", { $map: { input: "$$productId", as: "pid", in: { $toObjectId: "$$pid" } } }] } } },
            { $project: { sortValue: 1, view: 1 } }
          ],
          as: "catalogData"
        }
      },
      {
        $addFields: {
          "orders.invoiceOrderItems": {
            $map: {
              input: "$orders.invoiceOrderItems",
              as: "item",
              in: {
                $mergeObjects: [
                  "$$item",
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
                                    cond: { $eq: ["$$catalogItem._id", { $toObjectId: "$$item.productId" }] }
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
                    },
                    view: {
                      $ifNull: [
                        {
                          $arrayElemAt: [
                            {
                              $map: {
                                input: {
                                  $filter: {
                                    input: "$catalogData",
                                    as: "catalogItem",
                                    cond: { $eq: ["$$catalogItem._id", { $toObjectId: "$$item.productId" }] }
                                  }
                                },
                                as: "filteredCatalog",
                                in: "$$filteredCatalog.view"
                              }
                            },
                            0
                          ]
                        },
                        null
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        $group: {
          _id: "$_id",
          orders: { $push: "$orders" }
        }
      }
    ]).toArray();

    const viewData: ViewDataMap = {};

    for (const order of brief[0].orders) {
      if (order.invoiceOrderItems) {
        for (const item of order.invoiceOrderItems) {
          if (!viewData[item.view]) {
            viewData[item.view] = {};
          }

          if (!viewData[item.view][item.name]) {
            viewData[item.view][item.name] = {
              sortValue: item.sortValue || 0,
              weight: 0
            };
          }

          viewData[item.view][item.name].weight += item.weight;
        }
      }
    }

    return Object.keys(viewData).map(view => ({
      view,
      products: Object.keys(viewData[view]).map(name => ({
        name,
        sortValue: viewData[view][name].sortValue,
        weight: viewData[view][name].weight
      })).sort((a, b) => a.sortValue - b.sortValue)
    }));
  }
}

interface ProductData {
  sortValue: number;
  weight: number;
}

interface ViewData {
  [name: string]: ProductData;
}

interface ViewDataMap {
  [view: string]: ViewData;
}

export type OrderItemsRequest = {
  productId: string;
  positionId: string;
  comments: string;
  weight: number;
  units: string;
  isGift: boolean;
}

export type OrderItemsResponse = {
  productPrice: number;
  amount: number;
  name: string;
  view?: string;
  sortValue?: number;
  purchasePrice?: number;

} & OrderItemsRequest;

export type InvoiceType = {
  orderId: string;
  briefcaseId: string;
  deliveryRouteId: string;
  orderItems: OrderItemsResponse[];
  discount: number;
  priceDelivery: number;
  markOrder: boolean
}

export type InvoiceTypeRes = {
  userId: string,
  totalAmount: number,
  finalTotalAmount: number,
  orderItems: OrderItemsResponse[],
  markOrder: boolean
} & InvoiceType