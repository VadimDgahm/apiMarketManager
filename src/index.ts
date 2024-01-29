import express,{Response,Request} from "express"
import {clientsRoute} from './routes/clients-route';
import bodyParser  from 'body-parser'
import {runDb} from './repositories/db';
import dotenv  from 'dotenv'
import cors from 'cors';
import cookieParser from 'cookie-parser'
import {authRoute} from './routes/auth-route';
import {usersRoute} from './routes/users-route';
// import mongoose from 'mongoose'

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
app.use('/clients', clientsRoute)
app.use('/auth', authRoute)
app.use('/users', usersRoute)

app.get('/', (req: Request, res: Response) => {
    res.send('<h1 style={color: "red"}>HelloWord</h1>')
})

const startApp = async () => {

        await runDb()

    // process.env.DB_URL &&  await mongoose.connect(process.env.DB_URL)

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })


}
startApp()