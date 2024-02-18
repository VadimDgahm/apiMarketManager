import {Request, Response, Router} from 'express';
import {clientsService} from '../services/clients-service';
import { AuthenticatedRequest } from '../middlewares/checkActivation-middleware';


export const clientsRoute = Router({})

clientsRoute.get('/', async (req: AuthenticatedRequest, res: Response) => {
    let query = req.query
    let clients = await clientsService.findClients(query.name?.toString(), req.user.id)
    res.send(clients)
})
clientsRoute.post('/', async (req: AuthenticatedRequest, res: Response) => {
    const newClient = await clientsService.createClient(req.body, req.user.id)
    res.send(newClient)
})
clientsRoute.get('/:id', async (req: AuthenticatedRequest , res: Response) => {
    const client = await clientsService.getClientById(req.params.id , req.user.id)
    if (client) {
        res.send(client)
    } else {
        res.status(404).send('not Found')
    }
})
clientsRoute.put('/:id', async (req: Request, res: Response) => {
    const filter = req.body
    const answer = await clientsService.updateClient(req.params.id, filter)
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