import express, {Request, Response} from 'express';
import {clientsService} from '../services/clients-service';
import {AuthenticatedRequest} from '../middlewares/checkActivation-middleware';

const arrUsers = [{
	"id" : "ba2a37b8-016d-4aba-a06f-96a661353086",
	"name" : "Евгений",
	"status" : "новый",
	"source" : "",
	"phones" : [
		{
			"idPhone" : "867279c8-9cea-4df1-925b-2d60e054762a",
			"nameUserPhone" : "",
			"tel" : "37529749296"
		}
	],
	"addresses" : [
		{
			"buildingSection" : "",
			"city" : null,
			"code" : "",
			"floor" : "",
			"idAddress" : "bf18d1a4-acb3-48ba-b403-eadc50c5d2a1",
			"lobby" : "",
			"numberApartment" : "",
			"numberStreet" : "",
			"street" : ""
		}
	],
	"comments" : [ "" ],
	"dateLastOrder" : "12.02.2024",
	"createdDate" : "12.02.2024",
	"userId" : "ac74a9fb-7c28-4269-9453-273ace53652c"
},

/* 2 createdAt:12.02.2024, 12:48:04*/
{

	"id" : "33c74126-e2d1-41fd-9c6e-dada8ba31a0e",
	"name" : "Игорь",
	"status" : "постоянный",
	"source" : "Куфар",
	"phones" : [
		{
			"idPhone" : "2b855b61-8c64-4555-ad75-147fdc940f13",
			"nameUserPhone" : "",
			"tel" : "+375252758963"
		}
	],
	"addresses" : [ ],
	"comments" : [ "" ],
	"dateLastOrder" : "",
	"createdDate" : "12.02.2024",
	"userId" : "ac74a9fb-7c28-4269-9453-273ace53652c"
},

/* 3 createdAt:12.02.2024, 11:01:14*/
{
	
	"id" : "31922b92-f651-4052-a866-fd58ba364dc2",
	"name" : "Полина Юрьевна",
	"status" : "непостоянный",
	"source" : "Телеграмм",
	"phones" : [
		{
			"idPhone" : "e857c5e6-baa1-4ece-8495-d56131520b3e",
			"nameUserPhone" : "",
			"tel" : "+375252758963"
		}
	],
	"addresses" : [ ],
	"comments" : [ "" ],
	"dateLastOrder" : "12.02.2024",
	"createdDate" : "12.02.2024",
	"userId" : "ac74a9fb-7c28-4269-9453-273ace53652c"
},

/* 4 createdAt:11.02.2024, 19:16:34*/
{
	
	"id" : "76678cd8-8f21-4aea-87ec-0f989f625087",
	"name" : "Ярохович",
	"status" : "постоянный",
	"source" : "Вайбер",
	"phones" : [
		{
			"idPhone" : "cf70df2e-c57d-4760-bc7f-3ba44b8323f6",
			"nameUserPhone" : "",
			"tel" : "+375293562892"
		}
	],
	"addresses" : [
		{
			"buildingSection" : "",
			"city" : "",
			"code" : "",
			"floor" : "",
			"idAddress" : "1667dfb4-cc8b-4fa4-9495-ab82de254025",
			"lobby" : "",
			"numberApartment" : "",
			"numberStreet" : "",
			"street" : ""
		}
	],
	"comments" : [ "" ],
	"dateLastOrder" : "",
	"createdDate" : "11.02.2024",
	"userId" : "ac74a9fb-7c28-4269-9453-273ace53652c"
},

/* 5 createdAt:11.02.2024, 19:15:24*/
{
	
	"id" : "ff905951-ace4-487b-8ed3-80fc41a8ca29",
	"name" : "Вадим Ярохович",
	"status" : "непостоянный",
	"source" : "Инстаграм",
	"phones" : [
		{
			"idPhone" : "90610605-65bd-4683-8fad-54e77526f7eb",
			"nameUserPhone" : "Жена",
			"tel" : "+375289956235"
		},
		{
			"idPhone" : "bc103e29-a0ff-4052-b773-2edb10b72436",
			"nameUserPhone" : "Внук",
			"tel" : "+375289956235"
		}
	],
	"addresses" : [ ],
	"comments" : [ "" ],
	"dateLastOrder" : "14.02.2024",
	"createdDate" : "11.02.2024",
	"userId" : "ac74a9fb-7c28-4269-9453-273ace53652c"
}]

const clientsRoute = express.Router()

// @ts-ignore
clientsRoute.get('/',  (req: AuthenticatedRequest, res: Response) => {
    // let query = req.query
    // clientsService.findClients(query.name?.toString(), req.user.id).then(clients =>    res.send(clients) )
    res.send(arrUsers)
})
// @ts-ignore
clientsRoute.post('/', (req: AuthenticatedRequest, res: Response) => {
    clientsService.createClient(req.body, req.user.id).then(newClient => res.send(newClient))
})
// @ts-ignore
clientsRoute.get('/:id',  (req: AuthenticatedRequest , res: Response) => {
    let clientRes = {}
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