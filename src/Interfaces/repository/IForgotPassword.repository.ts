import { FilterQuery } from 'mongoose';

import { IOtp } from '../../Models/otpModel';
import { ISchool } from '../../Models/schoolModel';
import { IUser } from '../../Models/userModel';
import { UserRole } from '../../types/auth.types';

export interface IForgotPasswordRepository {
  findAdmin(email: string): Promise<IUser | null>;

  findSchool(email: string): Promise<ISchool | null>;

  isOtpExpired(query: FilterQuery<IOtp>): Promise<IOtp | null>;

  storeOtp(id: string, otp: string): Promise<IOtp | null> ;

  updatePassword<T>(role: UserRole, id: string, data: Partial<T>): Promise<T | null>;

  findAndUpdateAdmin(id: string, newPassword: string): Promise<IUser | null>;

  findAndUpdateSchool(id: string, newPassword: string): Promise<ISchool | null>;
}
