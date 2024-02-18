import {NextFunction, Request, Response} from 'express';
import ApiErrors from '../exceptions/api-error';
import {tokenService} from '../services/token-service';
import {UserType} from '../services/auth-service';
import {JwtPayload} from 'jsonwebtoken';
interface AuthenticatedRequest extends Request {
    user: JwtPayload;
}
export function isActivationMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
  try {
      const isActivated = req.user.isActivated
      if(!isActivated){
          return next(ApiErrors.NotActivation())
      }
       else{
        next()
       }
  } catch (e){
      return next(ApiErrors.UnauthorizedError())
  }
}