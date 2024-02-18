import express,{Response,Request} from "express"
import {clientsRoute} from './routes/clients-route';
import bodyParser  from 'body-parser'
import {runDb} from './repositories/db';
import dotenv  from 'dotenv'
import cors from 'cors';
import cookieParser from 'cookie-parser'
import {authRoute} from './routes/auth-route';
import {usersRoute} from './routes/users-route';
import errorMiddleware from './middlewares/error-middleware';
import {authMiddleware} from './middlewares/auth-middleware';
import { isActivationMiddleware } from "./middlewares/checkActivation-middleware";
import { briefcaseRoute } from "./routes/briefcase-route";
import { catalogRoute } from "./routes/catalog-route";
import { addressRoute } from "./routes/address-route";
import { phoneRoute } from "./routes/phone-route";


dotenv.config()
const app = express()
const port = process.env.PORT || 3000

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 600,
  };
const parserMiddleware = bodyParser()



app.use(parserMiddleware)
app.use(cookieParser())
app.use(cors(corsOptions));
app.use('/clients',authMiddleware,isActivationMiddleware, clientsRoute)
app.use('/', authRoute)
app.use('/users', authMiddleware, usersRoute)
app.use('/briefcase',authMiddleware,isActivationMiddleware, briefcaseRoute)
app.use('/address',authMiddleware, addressRoute)
app.use('/catalog',authMiddleware, catalogRoute)
app.use('/phone',authMiddleware, phoneRoute)
app.use(errorMiddleware)


const startApp = async () => {

        await runDb()
        app.listen(port, () => {
            console.log(`App listening on port ${port}`)
        })
}
startApp()