import {invoicesRepositories} from "../repositories/invoices-db-repositories";
import {catalogCollection} from "../repositories/db";
import {ObjectId} from "mongodb";

export const invoicesService = {
  async getInvoicesById(id: string) {
    return await invoicesRepositories.getInvoicesById(id);
  },

  async getOrderInvoiceById(briefcaseId: string, orderId: string) {
    return await invoicesRepositories.getOrderInvoiceById(briefcaseId, orderId);
  },

  async createInvoice(body: InvoiceType) {
    const invoiceOrderItems: OrderItemsResponse[] = [];
    let totalAmount = 0;


    for (const item of body.orderItems) {
      const product = await catalogCollection.findOne({_id: new ObjectId(item.productId)});

      const amount = +(product.price * item.weight).toFixed(2);
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

    const invoice: InvoiceTypeRes = {
      ...body,
      orderItems: invoiceOrderItems,
      totalAmount,
      finalTotalAmount,
    }

    return await invoicesRepositories.createInvoice(invoice);
  }
}

export type OrderItemsRequest = {
  productId: string;
  positionId: string;
  comments: string;
  weight: number;
  units: string;
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
}

export type InvoiceTypeRes = {
  totalAmount: number,
  finalTotalAmount: number,
  orderItems: OrderItemsResponse[],
} & InvoiceType