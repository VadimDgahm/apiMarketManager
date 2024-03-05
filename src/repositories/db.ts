import {MongoClient, ServerApiVersion} from 'mongodb'
import {ClientType} from '../services/clients-service';
import {UserType} from '../services/auth-service';
import {UserRefreshToken} from '../services/token-service';
import { BriefcaseType } from "../services/briefcase-service";
import { ProductType } from "../services/catalog-service";


const mongoUri = "mongodb://atlas-sql-65e47108cf579b502236c4fd-l2xx0.a.query.mongodb.net/meatMarket?ssl=true&authSource=admin"
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