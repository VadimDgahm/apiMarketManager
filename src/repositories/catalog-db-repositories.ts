
import {catalogCollection, usersCollection} from './db';
import {UserType} from '../services/auth-service';
import { ProductType, ProductTypeRequest } from '../services/catalog-service';


export const catalogRepositories = {
    async getCatalog(userId: string) {
      return await catalogCollection.find({userId}).toArray();
    },
    async createProduct(body: ProductType) {
      return await catalogCollection.insertOne(body)
    },
    async removeProduct(id: string, userId: string) {
      return await catalogCollection.deleteOne({id, userId})
    },
    async changeProduct(id: string, userId: string, body: ProductTypeRequest) {
      return await catalogCollection.findOneAndUpdate({id, userId}, { $set: body })
        
    }
}
