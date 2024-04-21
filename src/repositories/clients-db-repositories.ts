import {clientCollection} from './db';
import {ClientType, ClientTypeFilter} from '../services/clients-service';
import {QueryResponse} from '../routes/clients-route';


export const clientsRepositories = {
    async findClients(title: QueryResponse, id: string, page: number, pageSize: number): Promise<{clients: ClientType[], totalCount: number}> {

        const userClients = (await clientCollection.find({userId: id}).toArray()).reverse()
       
     
        
       
     
       if(userClients){
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedClients = userClients.slice(startIndex, endIndex);
        if (title) {
            const finishArr = userClients.filter( el =>{
                const nameMatch = el.name.toLocaleLowerCase().includes(title.toLocaleLowerCase())
                const phoneMatch = el.phones.some(phone => phone.tel.includes(title) )
                const addressMatch = el.addresses.some(address => address.street.toLocaleLowerCase().includes(title.toLocaleLowerCase()))
                return nameMatch || phoneMatch || addressMatch
            } )
            const paginatedFinishArr = finishArr.slice(startIndex, endIndex);
            return { clients: paginatedFinishArr, totalCount: finishArr.length}
        }
        else {
            return {
                clients: paginatedClients,
                totalCount: userClients.length
              };
        }
       }
       else {
        throw new Error('Клиенты не найдены')
       }
       
    },
    async createClient(body: ClientType): Promise<ClientType> {
        await clientCollection.insertOne(body)
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
