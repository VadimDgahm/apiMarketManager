import {NextFunction, Request, Response} from 'express';
import ApiErrors from '../exceptions/api-error';
import {tokenService} from '../services/token-service';
import {UserType} from '../services/auth-service';
import {JwtPayload} from 'jsonwebtoken';
interface AuthenticatedRequest extends Request {
    user: JwtPayload;
}
export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
  try {
      const accessToken = req.cookies.accessToken
      if(!accessToken){
          return next(ApiErrors.UnauthorizedError())
      }
        const userData = tokenService.validateAccessToken(accessToken)
      if(!userData){
          return next(ApiErrors.UnauthorizedError())
      }
      req.user = userData
      next()
  } catch (e){
      return next(ApiErrors.UnauthorizedError())
  }
}