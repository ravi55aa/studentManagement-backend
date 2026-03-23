import { Request, Response } from 'express';

import { IOtp } from '../../Models/otpModel';
import { ISchool } from '../../Models/schoolModel';
import { IUser } from '../../Models/userModel';
import { serviceReturnType } from '../../Constants/interfaces';

export interface IForgotPasswordService {
  verifyEmail(model: string, email: string): Promise<ISchool | IUser | null>;

  generateOtp(id: string): Promise<serviceReturnType>;

  findValidOtp(email: string, otp: string): Promise<IOtp | null>;

  verifyOtp(req: Request): Promise<serviceReturnType>;

  updatePassword(req: Request): Promise<serviceReturnType>;

  updatePasswordV2(req: Request, res: Response): Promise<serviceReturnType>;
}
