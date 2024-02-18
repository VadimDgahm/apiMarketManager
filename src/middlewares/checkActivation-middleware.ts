import {NextFunction, Request, Response} from 'express';
import ApiErrors from '../exceptions/api-error';

import {JwtPayload} from 'jsonwebtoken';
export interface AuthenticatedRequest extends Request {
    user: JwtPayload;
}
export function isActivationMiddleware(
    req: AuthenticatedRequest,
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