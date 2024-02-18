import {NextFunction, Request, Response, Router} from 'express';
import {UsersRepositories} from '../repositories/users-db-repositories';



export const usersRoute = Router({})

usersRoute.get('/',
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users =  await UsersRepositories.getUsers()
        res.send(users)
    } catch (e) {
        next(e)
    }
},);
