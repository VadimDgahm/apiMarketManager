import {NextFunction, Request, Response, Router} from 'express';
import {authService} from '../services/auth-service';


export const authRoute = Router({})

authRoute.post('/registration',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {email, password} = req.body
            const userData = await authService.registration(email, password)
            // res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60* 1000, httpOnly: true})
            res.send(userData)
        } catch (e) {
            res.status(400).send(e.message)
        }
    },);
authRoute.post('/login',
    (req: Request, res: Response, next: NextFunction) => {
        try {
        } catch (e) {
            console.log(e)
        }
    },)
authRoute.post('/logout',
    (req: Request, res: Response, next: NextFunction) => {
        try {
        } catch (e) {
            console.log(e)
        }
    },)

authRoute.get('/activate/:link',
    (req: Request, res: Response, next: NextFunction) => {
        try {
        } catch (e) {
            console.log(e)
        }
    },)
authRoute.get('/refresh',
    (req: Request, res: Response, next: NextFunction) => {
        try {
        } catch (e) {
            console.log(e)
        }
    },)
