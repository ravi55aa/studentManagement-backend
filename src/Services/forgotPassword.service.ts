import { Request } from 'express';
import { injectable, inject } from 'tsyringe';
import bcrypt from 'bcrypt';
import { Server } from 'socket.io';

import { TYPES } from '../DI/types';
import { IForgotPasswordService } from '../Interfaces/services/IForgotPasswordService.';
import { handleMailOptions, sendMail } from '../Constants/nodemail';
import { otp } from '../Utils/generateOtp';
import { IOtp } from '../Models/otpModel';
import { IUser } from '../Models/userModel';
import { ISchool } from '../Models/schoolModel';
import { serviceReturnType } from '../Constants/interfaces';
import { idToObjectId } from '../Repository/forgotPassword.Repository';
import { ForgotPasswordDTO } from '../dto/forogotPasssword.dto';
import { ApiResponse } from '../Constants/apiResponse';
import { AuthMessage } from '../Constants/resposeMessages';
import { IForgotPasswordRepository } from '../Interfaces/repository/IForgotPassword.repository';
import { getIO } from '../Config/socket.config';

@injectable()
export class ForgotPasswordService implements IForgotPasswordService {
  constructor(
    @inject(TYPES.ForgotPasswordRepository)
    private _repository: IForgotPasswordRepository,
  ) {}

  async verifyEmail(modelName: string, email: string): Promise<null | IUser | ISchool> {
    if (modelName == 'Admin') {
      return this._repository.findAdmin(email);
    } else if (modelName === 'School') {
      return this._repository.findSchool(email);
    }
    return null;
  }

  //generate-sendMail-storeDB
  public async generateOtp(id: string): Promise<serviceReturnType> {
    const newOtp = otp;
    const mailOptions = handleMailOptions(newOtp);
    await sendMail(mailOptions);

    const newOtpDoc = await this._repository.storeOtp(id!, newOtp);

    const socket: Server = getIO();
    socket.emit('otp:new', `Your otp is ${newOtp}`);

    return ApiResponse.success(newOtpDoc, AuthMessage.OtpVerified);
  }

  async findValidOtp(id: string, otp: string): Promise<IOtp | null> {
    const isExpired = await this._repository.isOtpExpired({ id: idToObjectId(id), otp: otp });

    return isExpired;
  }

  async verifyOtp(req: Request): Promise<serviceReturnType> {
    const { generatedOtp, userEnteredOtp } = req.body;
    const { id } = req.params;

    const data = (await this.findValidOtp(id!, generatedOtp)) && generatedOtp === userEnteredOtp;

    return ApiResponse.success(data, AuthMessage.OtpVerified);
  }

  async updatePassword(req: Request): Promise<serviceReturnType> {
    const { modelName, newPassword } = req.body;
    const { id } = req.params;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (modelName == 'Admin') {
      const updated = await this._repository.findAndUpdateAdmin(id!, hashedPassword);

      if (!updated) {
        return ApiResponse.failure(AuthMessage.InvalidCredentials);
      }

      return ApiResponse.success(null, AuthMessage.PasswordReset);
    } else if (modelName === 'School') {
      const updated = await this._repository.findAndUpdateSchool(id!, hashedPassword);

      if (!updated) {
        return ApiResponse.failure(AuthMessage.InvalidCredentials);
      }
    }

    return ApiResponse.success(null, AuthMessage.PasswordReset);
  }

  async updatePasswordV2(req: Request): Promise<serviceReturnType> {
    const { role, id, password } = ForgotPasswordDTO.changePassword(req);

    const hashedPassword = await bcrypt.hash(password, 10);
    let updated = null;

    if (role == 'School') {
      const data: Partial<ISchool> = { password: hashedPassword };
      updated = await this._repository.updatePassword<ISchool>(role, id, data);
    }

    if (!updated) {
      return ApiResponse.failure(AuthMessage.InvalidCredentials);
    }

    return ApiResponse.success(null, AuthMessage.PasswordReset);
  }
}
