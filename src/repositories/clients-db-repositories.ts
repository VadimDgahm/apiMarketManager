import {clientCollection} from './db';
import {ClientType} from '../services/clients-service';
import {QueryResponse} from '../routes/clients-route';


export const clientsRepositories = {
    async findClients(title: QueryResponse): Promise<ClientType[]> {
        const filter: any = {}
        if (title) {
            filter.name = {$regex: title}
        }
        const arr = await clientCollection.find(filter).toArray()
        return arr.map(el => {
            const {_id, ...arg} = el
            return arg
        })
    },
    async createClient(body: ClientType): Promise<ClientType> {
        const result = await clientCollection.insertOne(body)
        return body
    },
    async getClientById(id: string): Promise<ClientType | undefined> {
        const client: ClientType | null = await clientCollection.findOne({id})
        if (client) {
            return client
        } else {
            return undefined
        }
    },
    async updateClient(id: string, newName: string): Promise<boolean> {
        const result = await clientCollection.updateOne({id}, {$set: {name: newName}})
        return result.matchedCount === 1

    },
    async removeClient(id: string): Promise<boolean> {
        let result = await clientCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}
