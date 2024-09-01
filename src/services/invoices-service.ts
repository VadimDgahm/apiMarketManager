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
    const brief = await briefcaseCollection.findOne({id:briefcaseId});
    const res: { [key: string]: number } = {};

    for (const order of brief.orders) {
      if(order.invoiceOrderItems) {
        for  (const item of order.invoiceOrderItems) {
          const name = item.name;
          if (res[name]) {
            res[name] += item.weight;
          } else {
            res[name] = item.weight;
          }
        }
      }
    }

    return res;
  }
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
  name: string

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