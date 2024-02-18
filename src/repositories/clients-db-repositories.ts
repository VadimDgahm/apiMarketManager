import {clientCollection} from './db';
import {ClientType, ClientTypeFilter} from '../services/clients-service';
import {QueryResponse} from '../routes/clients-route';


export const clientsRepositories = {
    async findClients(title: QueryResponse, id: string): Promise<ClientType[]> {
        const userClients = await clientCollection.find({userId: id}).toArray()
       if(userClients){
        if (title) {
            return userClients.filter( el => el.name === title)
        }
        else {
            return userClients
        }
       }
       else {
        throw new Error('Клиенты не найдены')
       }
       
    },
    async createClient(body: ClientType): Promise<ClientType> {
        const result = await clientCollection.insertOne(body)
        return body
    },
    async getClientById(id: string, userId: string): Promise<ClientType | undefined> {
        const userClient = await clientCollection.findOne({id,userId})

        if (userClient) {
            return userClient
        } else {
            return undefined
        }
    },
    async updateClient(id: string, filter: ClientTypeFilter): Promise<boolean> {
        const result = await clientCollection.updateOne({id}, {$set: filter})
        return result.matchedCount === 1

    },
    async removeClient(id: string): Promise<boolean> {
        let result = await clientCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}
