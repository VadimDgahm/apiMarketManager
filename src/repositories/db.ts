import {MongoClient, ServerApiVersion} from 'mongodb'
import {ClientType} from '../services/clients-service';
import {UserType} from '../services/auth-service';
import {UserRefreshToken} from '../services/token-service';
import { BriefcaseType } from "../services/briefcase-service";
import { ProductType } from "../services/catalog-service";
import {deliveryRouteType} from "../services/delivery-routes-service";
import {InvoiceTypeRes} from "../services/invoices-service";

const password = process.env.DB_PASSWORD
const login = process.env.DB_LOGIN
 const mongoUri = `mongodb+srv://Pass123:Pass123@cluster0.hvknfqy.mongodb.net/meatMarket?retryWrites=true&w=majority&appName=Cluster0` || "mongodb://0.0.0.0:27037"
//const mongoUri = "mongodb://0.0.0.0:27017"

const client = new MongoClient(mongoUri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const db = client.db('meatMarket')
export const clientCollection = db.collection<ClientType>('clients')
export const usersCollection = db.collection<UserType>('users')
export const refreshTokenCollection = db.collection<UserRefreshToken>('refreshToken')
export const briefcaseCollection = db.collection<BriefcaseType>('briefcase')
export const catalogCollection = db.collection<ProductType>('catalog')
export const deliveryRoutesCollection = db.collection<deliveryRouteType>('deliveryRoutes')
export const invoicesCollection = db.collection<InvoiceTypeRes>('invoices')



export async  function  runDb() {
    try{
        await client.connect()
        await client.db("meatMarket").command({ping: 1})
        console.log("Connected successfully to mongo server")
    }catch(e) {
        console.log("can't to db")
        await client.close()

    }
}