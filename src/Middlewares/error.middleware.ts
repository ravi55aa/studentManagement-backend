
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { MongoServerError } from 'mongodb';

import logger from '../Utils/logger';
import { StatusCodes } from '../Constants/statusCodes';


export const handleErrorsMiddleware: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }

  logger.error('Unhandled application error', {
    layer: 'middleware',
    path: req.originalUrl,
    method: req.method,
    error: err,
  });

  /* ==============Unauthorized=================*/
  if (res.statusCode === StatusCodes.UNAUTHORIZED) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  /* ==============Mongo Duplicate Key Error=================*/
  if (err instanceof MongoServerError && err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0];
    const value = field ? err.keyValue[field] : '';

    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      message: `${field} '${value}' already exists`,
      field,
    });
  }

  /* ==============Mongoose Validation Error=================*/
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => e.message);

    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: errors[0],
      errors,
    });
  }

  /* ==============Invalid ObjectId (CastError)=================*/
  if (err instanceof mongoose.Error.CastError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: `Invalid ${err.path}`,
    });
  }

  /* ==============Fallback Error=================*/
  const status =
    res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : StatusCodes.INTERNAL_SERVER_ERROR;

  return res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

export default handleErrorsMiddleware;
