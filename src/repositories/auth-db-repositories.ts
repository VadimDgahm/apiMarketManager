
import {usersCollection} from './db';
import {UserType} from '../services/auth-service';


export const AuthDBRepositories = {
    async registration(body: UserType) {
      return await usersCollection.insertOne(body)
    },
    async login() {

    },
    async logout() {

    },
    async activate() {

    },
    async refresh() {
    }
}
