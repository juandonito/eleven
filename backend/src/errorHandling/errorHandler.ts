import { NextFunction, Request, Response } from 'express';
import { InternalServerError, NotFoundError } from './errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof NotFoundError) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
  if (err instanceof InternalServerError) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
};
