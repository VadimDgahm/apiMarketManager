import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt'
import {tokenService} from './token-service';
import {UsersRepositories} from '../repositories/users-db-repositories';
import ApiErrors from '../exceptions/api-error';
import {AuthDBRepositories} from '../repositories/auth-db-repositories';
export const authService = {
    async registration(email: string, password: string) {
        const candidate = await UsersRepositories.getUser({email})
        if (candidate) {
            throw ApiErrors.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = uuidv4()
        const body: UserType = {
            id: uuidv4(),
            activationLink,
            email,
            password: hashPassword,
            isActivated: true
        }
        await AuthDBRepositories.registration(body)
        const payload = {id: body.id, email, isActivated: body.isActivated}
        const tokens = tokenService.generationTokens(payload)
        await tokenService.saveToken(payload.id, tokens.refreshToken)
        // const res = await mailService.sendActivationMail(email, `${process.env.API_URL}/activate/${activationLink}`)
        return {...tokens, user: {...payload}}
    },
    async login(email: string, password: string) {
        const user = await UsersRepositories.getUser({email})
        if (!user) {
            throw ApiErrors.BadRequest(`Пользователь с таким ${email} не найден`)
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiErrors.BadRequest(`Неверный пароль`)
        }
        const payload = {id: user.id, email, isActivated: user.isActivated}
        const tokens = tokenService.generationTokens({...payload})
        await tokenService.saveToken(payload.id, tokens.refreshToken)
        return {...tokens, user: {...payload}}
    },
    async logout(refreshToken: string) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    },
    async activate() {

    },
    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ApiErrors.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        if(userData){
            const user = await UsersRepositories.getUser({id: userData.id})
            const tokenFromDB = await tokenService.findToken(refreshToken)
            if(!userData || !tokenFromDB){
                throw ApiErrors.UnauthorizedError()
            }
            if(user){
                const payload = {id: user.id, email: user.email, isActivated: user.isActivated}
                await tokenService.removeToken(payload.id)
                const tokens = tokenService.generationTokens(payload)
                await tokenService.saveToken(payload.id, tokens.refreshToken)
                return {...tokens, user:{...payload}}
            }
            else{
                throw ApiErrors.BadRequest("Непонятная ошибка")
            }
        }
    }
}


export type UserType = {
    id: string
    activationLink: string,
    email: string,
    password: string
    isActivated: boolean,
    privatePass?: string
}