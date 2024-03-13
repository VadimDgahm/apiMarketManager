import jwt, {JwtPayload} from 'jsonwebtoken'
import {refreshTokenCollection} from '../repositories/db';

export const tokenService = {
    generationTokens(payload: any) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET || 'new-token-secret', {expiresIn: '3h'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'new-refresh-token-secret', {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    },
    async saveToken(userId: string, refreshToken: string) {
        const tokenData = await refreshTokenCollection.findOne({user: userId})
        if (tokenData) {
            await refreshTokenCollection.updateOne({user: userId}, {$set: {refreshToken: refreshToken}})
        }
        const token = await refreshTokenCollection.insertOne({user: userId, refreshToken})
        return token
    },
    async removeToken ( user: string) {
        const tokenData = await refreshTokenCollection.deleteOne({user })
        return tokenData
    },
    async findToken (refreshToken: string) {
        const tokenData = await refreshTokenCollection.findOne({refreshToken})
        return tokenData
    },
    validateAccessToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'new-token-secret') as JwtPayload
            return userData
        } catch (e) {
            return null
        }
    },
    validateRefreshToken(token: string) {
        try {
            const userData =  jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'new-refresh-token-secret') as JwtPayload
            return userData
        } catch (e) {
            return null
        }
    },

}

export type UserRefreshToken = {
    user: string,
    refreshToken: string
}