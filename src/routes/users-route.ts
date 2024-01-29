import {NextFunction, Request, Response, Router} from 'express';



export const usersRoute = Router({})

usersRoute.get('/',
    (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json('All ok')
    } catch (e) {
        console.log(e)
    }
},);
