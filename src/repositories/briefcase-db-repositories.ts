import {NextFunction} from 'express';
import { briefcaseCollection, clientCollection } from './db';
import { BriefcaseOrder, BriefcaseType } from '../services/briefcase-service';

type GetUserType = {
    id?: string,
    email?: string,
}
export const briefcaseRepositories = {
    async getBriefcase(userId: string) {
     return await briefcaseCollection.find({userId}).toArray()
    },
    async getBriefcaseById(briefcaseId: string, userId: string) {
        return await briefcaseCollection.findOne({id:briefcaseId, userId})
    },
    async createBriefcase(order: BriefcaseType): Promise<BriefcaseType>{
       await briefcaseCollection.insertOne(order)
       return order
    },
    async createOrder(idBriefcase: string, body: BriefcaseOrder): Promise<BriefcaseOrder>{
       await briefcaseCollection.updateOne({id: idBriefcase},{$addToSet: {orders: body}})
       await clientCollection.updateOne({id: body.clientId}, { $set: {dateLastOrder: body.createdDate}})
        return body
     },
     async removeBriefcase(id: string): Promise<void>{
           const res = await briefcaseCollection.deleteOne({id})
      },
      async getPurchases(id: string): Promise<void>{
        const res = await briefcaseCollection.findOne({id})
        if(res){
            
        }
   },
     
}
