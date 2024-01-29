import {MongoClient} from "mongodb"
import {ClientType} from '../services/clients-service';
import {UserType} from '../services/auth-service';
import {UserRefreshToken} from '../services/token-service';


const mongoUri = process.env.mongoURI || 'mongodb://0.0.0.0:27017'
const client = new MongoClient(mongoUri);

const db = client.db('meatMarket')
export const clientCollection = db.collection<ClientType>('clients')
export const UsersCollection = db.collection<UserType>('users')
export const RefreshTokenCollection = db.collection<UserRefreshToken>('refreshToken')


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