import {clientsRepositories} from '../repositories/clients-db-repositories';
import {QueryResponse} from '../routes/clients-route';
import {v4 as uuidv4} from 'uuid';
import { getCurrentDate } from '../utils/utils';
import { BriefcaseOrder } from './briefcase-service';

export const clientsService = {
    async findClients(title: QueryResponse, id: string, page: number, pageSize: number): Promise<{clients: ClientType[], totalCount: number}> {
        return await clientsRepositories.findClients(title, id,page,pageSize)
    },

    async createClient({name, status = 'новый', source, phones,comments,addresses}: CreateClientProps, userId: string): Promise<ClientType> {

        const currentDate = getCurrentDate()
        const body: ClientType = {
            id: uuidv4(),
            name,
            status,
            source,
            phones,
            addresses: addresses.length ? addresses : [] ,
            comments,
            order: [],
            createdDate: currentDate,
            userId
        }
        const result = await clientsRepositories.createClient(body)
        return body
    },
    async getClientById(id: string, userId: string): Promise<ClientType | undefined> {
        const client = clientsRepositories.getClientById(id, userId)
    
        return client
    },
    async updateClient(id: string, filter: ClientTypeFilter): Promise<boolean> {
        return await clientsRepositories.updateClient(id, filter)


    },
    async removeClient(id: string): Promise<boolean> {
        return await clientsRepositories.removeClient(id)
    }
}

type StatusClient = 'постоянный' | 'новый' | 'непостоянный'
export type PhoneClient = {
    tel: string,
    nameUserPhone: string,
    idPhone: string;
}

 type AddressClient = {
    idAddress: string;
    buildingSection?: null | string; // корпус
    city: null | string;
    code?: null | string;
    floor?: null | string; //  этаж
    lobby?: null | string; //  подъзд
    numberApartment?: null | string;
    numberStreet: null | string;
    street: null | string;
  };
export type ClientType = {
    id: string,
    name: string,
    status?: StatusClient,
    source: string
    phones: PhoneClient[]
    addresses: AddressClient[]
    order: BriefcaseOrder[]
    comments: string[]
    createdDate: string
    userId: string
}
type CreateClientProps = Omit<ClientType, 'id'>


export type ClientTypeFilter = Partial<Pick<ClientType, 'name' | 'status' | "source"| "comments">>;