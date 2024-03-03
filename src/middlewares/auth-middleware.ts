import {NextFunction, Request, Response} from 'express';
import ApiErrors from '../exceptions/api-error';
import {tokenService} from '../services/token-service';
import { AuthenticatedRequest } from './checkActivation-middleware';

export function authMiddleware(
    req: AuthenticatedRequest,
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

      req.user = {id: userData.id, email: userData.email, isActivated: userData.isActivated}
      next()
  } catch (e){
      return next(ApiErrors.UnauthorizedError())
  }
}