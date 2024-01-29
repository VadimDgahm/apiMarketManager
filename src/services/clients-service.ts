import {clientsRepositories} from '../repositories/clients-db-repositories';
import {QueryResponse} from '../routes/clients-route';
import {v4 as uuidv4} from 'uuid';
import { getCurrentDate } from '../utils/utils';

export const clientsService = {
    async findClients(title: QueryResponse): Promise<ClientType[]> {
        return await clientsRepositories.findClients(title)
    },
    async createClient({name, status = 'new', source, phones, addresses,comments}: CreateClientProps): Promise<ClientType> {
        const currentDate = getCurrentDate()
        const body: ClientType = {
            id: uuidv4(),
            name,
            status,
            source,
            phones,
            addresses,
            comments,
            dateLastOrder: '',
            createdDate: currentDate
        }
        const result = await clientsRepositories.createClient(body)
        return body
    },
    async getClientById(id: string): Promise<ClientType | undefined> {
        const client = clientsRepositories.getClientById(id)
    
        return client
    },
    async updateClient(id: string, newName: string): Promise<boolean> {
        return await clientsRepositories.updateClient(id, newName)


    },
    async removeClient(id: string): Promise<boolean> {
        return await clientsRepositories.removeClient(id)
    }
}

type StatusClient = 'loyal' | 'new' | 'uncertain'
type PhoneClient = {
    tel: string,
    nameUserPhone: string
}
type AddressClient = {
    city: string,
    street: string,
    numberStreet: string,
    buildingSection?: string, // корпус
    numberApartment?: string,
    lobby?: string, //  подъзд
    floor?: string, //  этаж
    code?: string,
    statusAddress?: 'apartment' | 'house' | 'job'
}
export type ClientType = {
    id: string,
    name: string,
    status?: StatusClient,
    source: string
    phones: PhoneClient[]
    addresses: AddressClient[]
    dateLastOrder: string
    comments: string[]
    createdDate: string
}
type CreateClientProps = Omit<ClientType, 'id'>