import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

import { StatusCodes } from '../Constants/statusCodes';
import { IResponse } from '../Interfaces/Other/IResponse';
import { ApiResponse } from '../Constants/apiResponse';

const handleValidationErrors = (err: any, res: Response) => {
  if (err instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Validation Error',
      error: JSON.stringify(err.issues),
      data: null,
    } as IResponse<null>);
  }

  return ApiResponse.failure(`Validation Error ${err.issues}`);
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
