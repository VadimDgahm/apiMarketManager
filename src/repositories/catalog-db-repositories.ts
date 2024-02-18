
import {catalogCollection, usersCollection} from './db';
import {UserType} from '../services/auth-service';
import { ProductType } from '../services/catalog-service';


export const catalogRepositories = {
    async getCatalog() {
      return await catalogCollection.find().toArray()
    },
    async createProduct(body: ProductType) {
      return await catalogCollection.insertOne(body)
    },
    async removeProduct(id: string, userId: string) {
      return await catalogCollection.deleteOne({id, userId})
    }
}
