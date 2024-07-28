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
  async getInvoicesById(id: string) {
    const deliveryRoute = await deliveryRoutesCollection.findOne({_id: new ObjectId(id)})
    const result: DeliveryRouteResponse = {
      ...deliveryRoute,
      orders: [],
      drTotalAmount: 0
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

        for (const order of orders) {
          const client = await clientCollection.findOne({id: order.clientId});
          order.dataClient = {
            name: client.name,
            status: client.status,
            source: client.source,
            phones: client.phones,
            addresses: client.addresses
          };

          const invoice = await invoicesCollection.findOne({orderId:order.orderId});

          if(invoice) {
            order.invoiceOrderItems = invoice.orderItems;

            order.totalAmount = invoice.totalAmount;
            order.finalTotalAmount = invoice.finalTotalAmount;
            order.discount = invoice.discount;
            order.priceDelivery = invoice.priceDelivery;

            result.drTotalAmount += order.finalTotalAmount;
          }
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

  async createInvoice(body:InvoiceType) {
    const query = { orderId: body.orderId };
    const update = { $set: body};
    const options = { upsert: true };

    return await invoicesCollection.updateOne(query, update, options);
  },

  async getOrderInvoiceById(briefcaseId: string, orderId:string) {
    const res = await briefcaseCollection.findOne({id: briefcaseId})

    if(res) {
      const order = res.orders.find((o) => o.orderId === orderId);
      const invoice = await invoicesCollection.findOne({orderId:order.orderId});

      if (invoice) {
        order.invoiceOrderItems = invoice.orderItems;
        order.totalAmount = invoice.totalAmount;
        order.finalTotalAmount = invoice.finalTotalAmount;
        order.discount = invoice.discount;
        order.priceDelivery = invoice.priceDelivery;
      }

      return order;
    }
  },

  async getDR(drId: string) {
    return await deliveryRoutesCollection.findOne({_id: new ObjectId(drId)});
  },

  async deleteManyInvoices(query: Filter<InvoiceTypeRes>) {
    return await invoicesCollection.deleteMany(query);
  }
}
