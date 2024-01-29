const clients: ClientType[] = [{id: 0, name: 'Vadim'},{id: 1, name: "Gena"},{id: 3, name: 'Alina'},]
type ClientType = {
    id: number,
    name: string
}
export const clientsRepositories = {
    async findClients():Promise<ClientType[]>{
        return clients
    },
    async createClient( name: string): Promise<ClientType>{
        const body = {
            id: +(new Date()),
            name
        }
        clients.push(body)
        return body
    },
    async getClientById(id: number): Promise<ClientType | undefined>  {
        const client = clients.find(el => el.id === id)
        if(client){
            return client
        }
        else {
            return undefined
        }
    },
    async updateClient(id: number, newName: string):Promise<boolean>{
        const client = clients.find(el => el.id === id)

        if(client) {
            client.name = newName
            return true
        }
        else return false

    },
    async removeClient(id: number):Promise<boolean> {
        for(let i = 0; i < clients.length; i++){
            if(clients[i].id === id){
                clients.splice(i,1)
                return true
            }
        }
        return false
    }
}