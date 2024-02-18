import {NextFunction} from 'express';
import {usersCollection} from './db';

type GetUserType = {
    id?: string,
    email?: string,
}
export const UsersRepositories = {
    async getUser({email, id}: GetUserType) {
     
        if (email) {
            return await usersCollection.findOne({email});
        }
        if (id) {
            return await usersCollection.findOne({id});
        }
    },
    async getUsers() {
        debugger
        const result = await usersCollection.find().toArray();
        return result


    }
}
