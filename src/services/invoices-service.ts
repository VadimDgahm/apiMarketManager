import {invoicesRepositories} from "../repositories/invoices-db-repositories";

export const invoicesService = {
  async getInvoicesById(id: string) {
    return await invoicesRepositories.getInvoicesById(id);
  },

  async getOrderInvoiceById(briefcaseId: string, orderId:string) {
    return await invoicesRepositories.getOrderInvoiceById(briefcaseId, orderId);
  },

  async createInvoice(body:InvoiceType) {
    return await invoicesRepositories.createInvoice(body);
  }
}

export type OrderItemsRequest = {
  productId: string;
  weight: number;
  units:string;
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
  orderItems: OrderItemsRequest[];
  discount: number;
  priceDelivery: number;
}