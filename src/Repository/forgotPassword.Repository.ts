import { FilterQuery, Schema } from 'mongoose';
import { injectable } from 'tsyringe';
import studentModel from '@Models/Student/studentModel';

import { IForgotPasswordRepository } from '../Interfaces/repository/IForgotPassword.repository';
import { adminModel } from '../Models';
import { IOtp, OtpModel } from '../Models/otpModel';
import schoolModel, { ISchool } from '../Models/schoolModel';
import { IUser } from '../Models/userModel';
import { UserRole } from '../types/auth.types';
import logger from '../Utils/logger';

export const idToObjectId = (id: string) => {
  return new Schema.Types.ObjectId(id);
};

@injectable()
export class ForgotPasswordRepository implements IForgotPasswordRepository {
  async findAdmin(email: string): Promise<IUser | null> {
    try {
      return await adminModel.findOne({ email }).lean<IUser>();
    } catch (error) {
      logger.error('Error finding admin:', error);
      return null;
    }
  }

  async findSchool(email: string): Promise<ISchool | null> {
    try {
      return await schoolModel.findOne({ email }).lean<ISchool>();
    } catch (error) {
      logger.error('Error finding school:', error);
      return null;
    }
  }

  async isOtpExpired(query: FilterQuery<IOtp>): Promise<IOtp | null> {
    try {
      if (!query || Object.keys(query).length === 0) {
        return null;
      }

      return await OtpModel.findOne(query).lean<IOtp>();
    } catch (error) {
      logger.error('Error checking OTP expiration:', error);
      return null;
    }
  }

  async storeOtp(id: string, otp: string): Promise<IOtp | null> {
    try {
      const newOtp = await OtpModel.create({
        id: idToObjectId(id),
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      return newOtp;
    } catch (error) {
      logger.error('Error storing OTP:', error);
      return null;
    }
  }

  async updatePassword<T>(role: UserRole, id: string, data: Partial<T>): Promise<T | null> {
    try {
      if (role == 'School') {
        return await schoolModel
          .findByIdAndUpdate(id, data, { new: true, runValidators: true })
          .lean<T>();
      }

      if (role == 'Student') {
        return await studentModel
          .findByIdAndUpdate(id, data, { new: true, runValidators: true })
          .lean<T>();
      }

      return null;
    } catch (error) {
      logger.error('Error updating password:', error);
      return null;
    }
  }

  async findAndUpdateAdmin(id: string, newPassword: string): Promise<IUser | null> {
    try {
      return await adminModel
        .findOneAndUpdate(
          { _id: id },
          { $set: { password: newPassword } },
          { new: true, runValidators: true },
        )
        .lean<IUser>();
    } catch (error) {
      logger.error('Error updating admin password:', error);
      return null;
    }
  }

  async findAndUpdateSchool(id: string, newPassword: string): Promise<ISchool | null> {
    try {
      return await schoolModel
        .findOneAndUpdate(
          { _id: id },
          { $set: { password: newPassword } },
          { new: true, runValidators: true },
        )
        .lean<ISchool>();
    } catch (error) {
      logger.error('Error updating school password:', error);
      return null;
    }
  }
}
