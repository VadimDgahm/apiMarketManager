import {Request, Response, Router} from 'express';
import { ParsedQs } from 'qs';
import {clientsService} from '../services/clients-service';


export const clientsRoute = Router({})

clientsRoute.get('/', async (req: Request, res: Response) => {
    let query = req.query
    let clients = await clientsService.findClients(query.name?.toString())
    res.send(clients)
})
clientsRoute.post('/', async (req: Request, res: Response) => {
    const newClient = await clientsService.createClient(req.body)
    res.send(newClient)
})
clientsRoute.get('/:id', async (req: Request, res: Response) => {
    const client = await clientsService.getClientById(req.params.id)
    if (client) {
        res.send(client)
    } else {
        res.status(404).send('not Find')
    }
})
clientsRoute.put('/:id', async (req: Request, res: Response) => {
    const {name} = req.body
    const answer = await clientsService.updateClient(req.params.id, name)
    if (answer) {
        res.status(200).send("clients updated")
    } else {
        res.status(400).send('client not updated')
    }

})
clientsRoute.delete('/:id', async (req: Request, res: Response) => {
    const answer = await clientsService.removeClient(req.params.id.toString())
    answer && res.status(200).send('success')
    !answer && res.status(404).send('not found client')
})


export type QueryResponse = string | null | undefined