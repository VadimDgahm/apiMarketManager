import {NextFunction} from 'express';
import {UsersCollection} from '../repositories/db';
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt'
import {mailService} from './mail-service';
import {tokenService} from './token-service';

export const authService = {
    async registration(email: string, password: string) {
        const candidate = await UsersCollection.findOne({email});
        if (candidate) {
            throw new Error(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = uuidv4()
        const body: UserType  = {
            id: uuidv4(),
            activationLink,
            email,
            password: hashPassword,
            isActivated: false
        }
         const user = await UsersCollection.insertOne(body)
         const payload = {id: body.id, email,isActivated: body.isActivated }
         const tokens = tokenService.generationTokens(payload)
        await  tokenService.saveToken(body.id ,tokens.refreshToken)
        // const res = await mailService.sendActivationMail(email, `${process.env.API_URL}/activate/${activationLink}`)
        return {...tokens, user: {...payload }}
    },
    async login(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (e) {
            console.log(e)
        }
    },
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (e) {
            console.log(e)
        }
    },
    async activate(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (e) {
            console.log(e)
        }
    },
    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (e) {
            console.log(e)
        }
    }
}


export type UserType = {
    id: string
    activationLink: string,
    email: string,
    password: string
    isActivated: boolean
}