import {
  briefcaseCollection,
  catalogCollection,
  clientCollection,
  deliveryRoutesCollection,
  invoicesCollection
} from './db';
import {DeliveryRouteRequest, DeliveryRouteResponse, deliveryRouteType} from "../services/delivery-routes-service";
import {ObjectId} from "mongodb";
import {BriefcaseOrder} from "../services/briefcase-service";
import {InvoiceType, invoicesService, OrderItemsResponse} from "../services/invoices-service";

export const invoicesRepositories = {
  async getInvoicesById(id: string) {
    const deliveryRoute = await deliveryRoutesCollection.findOne({_id: new ObjectId(id)})
    const result: DeliveryRouteResponse = {
      ...deliveryRoute,
      drTotalAmount: 0,
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

          const invoice = await invoicesCollection.findOne({orderId:order.orderId});

          if(invoice) {
            const invoiceOrderItems: OrderItemsResponse[] = [];
            let totalAmount = 0;

            for (const item of invoice.orderItems) {
              const product = await catalogCollection.findOne({_id: new ObjectId(item.productId)});

              const amount = +(product.price * item.weight).toFixed(2);
              totalAmount += amount;

              invoiceOrderItems.push({
                ...item,
                productPrice: product.price,
                name: product.name,
                amount: amount
              });
            }

            order.invoiceOrderItems = invoiceOrderItems;
            order.totalAmount = +totalAmount.toFixed(2) + invoice.priceDelivery;
            order.finalTotalAmount = +(order.totalAmount * (1 - invoice.discount / 100)).toFixed(2);
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
        const invoiceOrderItems: OrderItemsResponse[] = [];
        let totalAmount = 0;

        for (const item of invoice.orderItems) {
          const product = await catalogCollection.findOne({_id: new ObjectId(item.productId)});

          const amount = +(product.price * item.weight).toFixed(2);
          totalAmount += amount;

          invoiceOrderItems.push({
            ...item,
            productPrice: product.price,
            name: product.name,
            amount: amount,
            units: item.units
          });
        }

        order.invoiceOrderItems = invoiceOrderItems;
        order.totalAmount = +totalAmount.toFixed(2) + invoice.priceDelivery;
        order.finalTotalAmount = +(order.totalAmount * (1 - invoice.discount / 100)).toFixed(2);
        order.discount = invoice.discount;
        order.priceDelivery = invoice.priceDelivery;
      }

      return order;
    }
  }
}
