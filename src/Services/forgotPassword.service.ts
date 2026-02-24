import { Request } from 'express';
import { IForgotPasswordService } from '../Interfaces/services/IForgotPasswordService.';
import { sendMail, SendMailOptions } from '../Constants/nodemail';
import { otp } from '../Utils/generateOtp';
import { IOtp } from '../Models/otpModel';
import { IUser } from '../Models/userModel';
import { ISchool } from '../Models/schoolModel';
import { IResponse } from '../Interfaces/IResponse';
import { serviceReturnType } from '../Constants/interfaces';
import { ForgotPasswordRepository, idToObjectId } from '../Repository/forgotPassword.Repository';
import { StatusCodes } from '../Constants/statusCodes';
import { ForgotPasswordDTO } from '../dto/forogotPasssword.dto';
import { injectable, inject } from 'tsyringe';
import { ApiResponse } from '../Constants/apiResponse';
import { AuthMessage } from '../Constants/resposeMessages';
import bcrypt from "bcrypt";


@injectable()
export class ForgotPasswordService implements IForgotPasswordService {
  constructor(
    @inject(ForgotPasswordRepository)
    private repository: ForgotPasswordRepository,
  ) {}

  async verifyEmail(modelName: string, email: string): Promise<null | IUser | ISchool> {
    if (modelName == 'admin') {
      return this.repository?.findAdmin(email); //repository call
    } else if (modelName === 'school') {
      return this.repository?.findSchool(email); //repository call
    }

    return null;
  }

  //generate-sendMail-storeDB
  async generateOtp(req: Request): Promise<serviceReturnType> {
    const { id } = req.params;
    const newOtp = otp;

    const mailOptions: SendMailOptions = {
      to: 'raviaa912@gmail.com',
      subject: 'Password change otp',
      html: `<P>You're otp is ${newOtp}</p>1}
            sendMail`,
      text: 'kindly Update the otp',
    };

    await sendMail(mailOptions);
    //add a find User by id
    //to check does id is already there;

    const newOtpDoc = await this.repository.storeOtp(id!, newOtp);

    return ApiResponse.success(newOtpDoc,AuthMessage.OtpVerified);
  }

  async findValidOtp(id: string, otp: string): Promise<IOtp | null> {
    const isExpired = await this.repository.isOtpExpired({ id: idToObjectId(id), otp: otp });

    return isExpired;
  }

  async verifyOtp(req: Request): Promise<serviceReturnType> {

    const { generatedOtp, userEnteredOtp } = req.body;
    const { id } = req.params;
    
    const data = (await this.findValidOtp(id!, generatedOtp)) && generatedOtp === userEnteredOtp;

    return ApiResponse.success(data,AuthMessage.OtpVerified);
  }

  async updatePassword(req: Request): Promise<serviceReturnType> {

    const { modelName, newPassword } = req.body;
    const { id } = req.params;

    if (modelName == 'admin') {
      const updated = await this.repository?.findAndUpdateAdmin(id!, newPassword);

      if (!updated) {
        return ApiResponse.failure(AuthMessage.InvalidCredentials);
      }

      return ApiResponse.success(null,AuthMessage.PasswordReset);

    } else if (modelName === 'school') {
      const updated = await this.repository?.findAndUpdateSchool(id!, newPassword);
      
      if (!updated) {
        return ApiResponse.failure(AuthMessage.InvalidCredentials);
      }
    }
    
    return ApiResponse.success(null,AuthMessage.PasswordReset);
  }

  async updatePasswordV2(req: Request): Promise<serviceReturnType> {
    const { role, id, password } = ForgotPasswordDTO.changePassword(req);

    const hashedPassword = await bcrypt.hash(password, 10);
    let updated = null;

    if (role == 'School') {
      const data: Partial<ISchool> = { password: hashedPassword };
      updated = await this.repository.updatePassword<ISchool>(role, id, data);
    }

    if (!updated) {
      return ApiResponse.failure(AuthMessage.InvalidCredentials);
    }

    return ApiResponse.success(null,AuthMessage.PasswordReset);
  }
}
