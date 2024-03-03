import {NextFunction, Request, Response} from 'express';
import ApiErrors from '../exceptions/api-error';

export type DataTypeRequest = {
    id: string
    email: string
    isActivated: boolean
}

export type AuthenticatedRequest = {
    user: DataTypeRequest;
} & Request
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