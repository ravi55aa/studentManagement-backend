import { NextFunction, Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';

const handleErrorsMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err); // let Express handle it
  }

  if (req.statusCode == 401) {
    return res.status(401).json({ description: 'Un_Authorized', error: err, message: err.message });
  }

  /**
   * ==================================
   *  Mongo duplicate key error
   * ==================================
   */
  if (err instanceof MongoServerError && err.code === 11000) {
    const field = Object.keys(err.keyValue)[1];
    let value = '';
    if (field) {
      value = err.keyValue[field];
    }

    return res.status(409).json({
      success: false,
      message: `${field} '${value}' already exists`,
      field,
    });
  }

  /**
   * ==================================
   *  Mongoose validation error
   * ==================================
   */
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => e.message);

    return res.status(400).json({
      success: false,
      message: errors[0],
    });
  }

  /**
   * ==================================
   *  CastError (invalid ObjectId)
   * ==================================
   */
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}`,
    });
  }

  const status = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: err,
  });
};

export default handleErrorsMiddleware;
