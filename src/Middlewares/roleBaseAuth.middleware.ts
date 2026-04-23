import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from '@Constants/statusCodes';
import schoolModel from '@Models/schoolModel';
import { SchoolMessage } from '@Constants/resposeMessages';

export const handleSubdomainResolver = async (req: Request, res: Response, next: NextFunction) => {
  const host = req.hostname;

  const subdomain = host.split('.')[0];

  if (subdomain === 'localhost' || subdomain === 'admin') {
    return next();
  }

  const school = await schoolModel.findOne({ subdomain,status:'verified' });

  if (!school) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: SchoolMessage.notVerified });
  }

  next();
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req?.user;

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Unauthorized. No user found.',
        data: null,
        error: 'NoUser',
      });
    }

    if (!roles.includes(user.role!)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
        data: null,
        error: 'Forbidden',
      });
    }

    next();
  };
};
