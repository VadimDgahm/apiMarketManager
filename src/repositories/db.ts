import {MongoClient} from "mongodb"
import {ClientType} from '../services/clients-service';
import {UserType} from '../services/auth-service';
import {UserRefreshToken} from '../services/token-service';
import { BriefcaseType } from "../services/briefcase-service";
import { ProductType } from "../services/catalog-service";


const mongoUri = process.env.mongoURI || 'mongodb://0.0.0.0:27017'
const client = new MongoClient(mongoUri);

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
    }catch {
        console.log("can`t to db")
        await client.close()

    }
}