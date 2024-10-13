import {NextFunction, Request, Response, Router} from 'express';
import {authService} from '../services/auth-service';
import {body, validationResult} from 'express-validator'
import ApiErrors from '../exceptions/api-error';
import { authMiddleware } from '../middlewares/auth-middleware';


export const authRoute = Router({})

authRoute.post('/registration',
    body('password').isLength({min: 3, max: 32}).isString(),
    async (req: Request, res: Response, next: NextFunction) => {

        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return  next(ApiErrors.BadRequest("Ошибка при валидации", errors.array()))
            }
            const {email, password} = req.body
            const userData = await authService.registration(email, password)
           return  res.send(userData)
        } catch (e) {
            next(e)
        }
    },);
authRoute.post('/login',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {email, password} = req.body

            const userData = await authService.login(email,password)
            res.cookie('accessToken', userData?.accessToken, {maxAge: 30 * 60 * 60 * 1000 , httpOnly: true, sameSite: 'none', secure: true})
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true})

            return  res.send(userData)
        } catch (e) {
            next(e)
        }
    },)
authRoute.post('/logout',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {refreshToken} = req.cookies;
            const token = await authService.logout(refreshToken)
            res.clearCookie('refreshToken')
            res.clearCookie('accessToken')
            return res.send(token)
        } catch (e) {
            next(e)
        }
    },)

authRoute.get('/activate/:link',
    (req: Request, res: Response, next: NextFunction) => {
        try {
        } catch (e) {
            next(e)
        }
    },)
authRoute.get('/refresh',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {refreshToken} = req.cookies;
            const userData = await authService.refresh(refreshToken);
            res.cookie('accessToken', userData?.accessToken, {maxAge: 30 * 24 * 60 * 60 * 1000 , httpOnly: true, sameSite: 'none', secure: true});
            res.cookie('refreshToken', userData?.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true});
            return  res.send(userData)
        } catch (e) {
            next(e)
        }
    },)

    authRoute.get('/me',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {accessToken, refreshToken} = req.cookies;

           if(refreshToken){
            res.status(200).send({message: "Пользователь авторизован"})
           }
           else res.status(401).send({message: "Пользователь не авторизован"})
        } catch (e) {
            next(e)
        }
    },)


authRoute.get('/',authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
                res.send('Hello world')
    },)
