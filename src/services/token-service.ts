import jwt from 'jsonwebtoken'
import {RefreshTokenCollection} from '../repositories/db';

export const tokenService = {
    generationTokens(payload: any) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET || 'new-token-secret', {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'new-refresh-token-secret', {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    },
    async saveToken(userId: string, refreshToken: string) {
        const tokenData = await RefreshTokenCollection.findOne({user: userId})
        if (tokenData) {
            await RefreshTokenCollection.updateOne({user: userId}, {$set: {refreshToken: refreshToken}})
        }
        const token = await RefreshTokenCollection.insertOne({user: userId, refreshToken})
        return token
    }

}

export type UserRefreshToken = {
    user: string,
    refreshToken: string
}