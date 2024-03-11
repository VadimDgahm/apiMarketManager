import express from "express"
import clientsRoute from './routes/clients-route';
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
import path from "path";


dotenv.config()
const app = express()
const port = process.env.PORT

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 600,
  };
const parserMiddleware = bodyParser()

const publicPath = path.join(__dirname, 'public');

app.use(express.static(publicPath));



app.use(parserMiddleware)
app.use(cookieParser())
app.use(cors(corsOptions));
// @ts-ignore
app.use('/clients',authMiddleware,isActivationMiddleware, clientsRoute)

app.use('/', authRoute)
// @ts-ignore
app.use('/users', authMiddleware, usersRoute)
// @ts-ignore
app.use('/briefcase',authMiddleware,isActivationMiddleware, briefcaseRoute)
// @ts-ignore
app.use('/address',authMiddleware, addressRoute)
// @ts-ignore
app.use('/catalog',authMiddleware,isActivationMiddleware, catalogRoute)
// @ts-ignore
app.use('/phone',authMiddleware, phoneRoute)
app.use(errorMiddleware)


const startApp = async () => {

        await runDb()
        app.listen(port, () => {
            console.log(`App listening on port ${port}`)
        })
}
startApp()