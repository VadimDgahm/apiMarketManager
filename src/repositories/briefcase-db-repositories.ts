import { briefcaseCollection, clientCollection } from './db';
import { BriefcaseOrder, BriefcaseType } from '../services/briefcase-service';

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
        const briefcase = await briefcaseCollection.findOne({id:briefcaseId, userId})
        briefcase.orders.reverse()
        return briefcase
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
           const res = await briefcaseCollection.deleteOne({id})
      },
      async getPurchases(id: string): Promise<void>{
        const res = await briefcaseCollection.findOne({id})
    },
    async removeOrder(idBriefcase: string, orderId: string): Promise<any>{
        const res = await briefcaseCollection.findOne({id: idBriefcase})
        
        if(res){
            const order = res.orders.find((o) => o.orderId === orderId);
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
     
}
