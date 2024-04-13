import express, {Request, Response} from 'express';
import {clientsService} from '../services/clients-service';
import {AuthenticatedRequest} from '../middlewares/checkActivation-middleware';


const clientsRoute = express.Router()

// @ts-ignore
clientsRoute.get('/',  (req: AuthenticatedRequest, res: Response) => {

    let query = req.query

    clientsService.findClients(query.search?.toString(), req.user.id, +query.page, +query.pageSize).then(clients =>    res.send(clients) )

})
// @ts-ignore
clientsRoute.post('/', (req: AuthenticatedRequest, res: Response) => {
    clientsService.createClient(req.body, req.user.id).then(newClient => res.send(newClient))
})
// @ts-ignore
clientsRoute.get('/:id',  (req: AuthenticatedRequest , res: Response) => {
     clientsService.getClientById(req.params.id , req.user.id).then(client => {
         res.send(client)
     }).catch(e => res.status(404).send({message: ['not Found', e.messages]}) )
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

export default clientsRoute