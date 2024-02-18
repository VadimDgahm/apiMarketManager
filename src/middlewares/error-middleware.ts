import { Request, Response, NextFunction } from 'express';
import ApiErrors from '../exceptions/api-error';

export default function errorMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(err);

    if (err instanceof ApiErrors) {
        return res.status(err.status).send({ message: err.message, errors: err.errors });
    }

    return res.status(500).send({ message: "Непредвиденная ошибка" });
}