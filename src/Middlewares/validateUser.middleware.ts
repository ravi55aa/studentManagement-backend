import { Request, Response, NextFunction } from 'express';

import { StatusCodes } from '../Constants/statusCodes';
import { IResponse } from '../Interfaces/IResponse';
import { ZodSchema, ZodError } from 'zod';

const handleValidationErrors = (err: any, res: Response) => {
  if (err instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Validation Error',
      error: JSON.stringify(err.issues),
      data: null,
    } as IResponse<null>);
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Unexpected error',
    error: err.issues,
    data: null,
  } as IResponse<null>);
};

export const validateData =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      handleValidationErrors(err, res);
    }
  };

export const handleValidationOF = <T extends object>(
  schema: ZodSchema<T>,
  formData: T,
  res: Response,
) => {
  try {
    schema.safeParse(formData);
  } catch (err) {
    handleValidationErrors(err, res);
  }
};
