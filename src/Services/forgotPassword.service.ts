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

    const responseBody: IResponse<IOtp> = {
      success: true,
      data: newOtpDoc,
      error: null,
      message: 'Otp generated Successfully',
    };

    return { status: StatusCodes.OK, resBody: responseBody };
  }

  async findValidOtp(id: string, otp: string): Promise<IOtp | null> {
    const isExpired = await this.repository.isOtpExpired({ id: idToObjectId(id), otp: otp });

    return isExpired;
  }

  async verifyOtp(req: Request): Promise<serviceReturnType> {
    //! move to dto
    const { generatedOtp, userEnteredOtp } = req.body;
    const { id } = req.params;
    //! move to dto

    const data = (await this.findValidOtp(id!, generatedOtp)) && generatedOtp === userEnteredOtp;

    const status = data ? StatusCodes.OK : StatusCodes.CONFLICT;

    const responseBody = {
      success: data ? true : false,
      data: data,
      error: data ? null : 'otp verification is failed',
      message: data ? 'otp verification successful' : 'otp verification failed',
    };

    return { status: status, resBody: responseBody };
  }

  async updatePassword(req: Request): Promise<serviceReturnType> {
    let updatedStatus: number = StatusCodes.BAD_REQUEST;

    let responseBody: IResponse<IUser | ISchool | null> = {
      success: false,
      data: null,
      error: 'Invalid model name',
      message: 'Invalid request',
    };

    const { modelName, newPassword } = req.body;
    const { id } = req.params;

    if (modelName == 'admin') {
      const adminPassUpdated = await this.repository?.findAndUpdateAdmin(id!, newPassword);

      updatedStatus = adminPassUpdated ? StatusCodes.OK : StatusCodes.CONFLICT;

      responseBody = {
        success: adminPassUpdated ? true : false,
        data: adminPassUpdated,
        error: adminPassUpdated ? null : "user password haven't updated",
        message: adminPassUpdated
          ? 'Password updated successfully'
          : "Password isn't updated successfully",
      };
    } else if (modelName === 'school') {
      const schoolPassUpdated = await this.repository?.findAndUpdateSchool(id!, newPassword);

      updatedStatus = schoolPassUpdated ? StatusCodes.OK : StatusCodes.CONFLICT;

      responseBody = {
        success: schoolPassUpdated ? true : false,
        data: schoolPassUpdated,
        error: schoolPassUpdated ? null : "user password haven't updated",
        message: schoolPassUpdated
          ? 'Password updated successfully'
          : "Password isn't updated successfully",
      };
    }

    return { status: updatedStatus, resBody: responseBody };
  }

  async updatePasswordV2(req: Request): Promise<serviceReturnType> {
    const { role, id, password } = ForgotPasswordDTO.changePassword(req);

    //const hashedPassword = await bcrypt.hash(newPassword, 10);
    let updated = null;

    if (role == 'School') {
      const data: Partial<ISchool> = { password: password };
      updated = await this.repository.updatePassword<ISchool>(role, id, data);
    }

    if (!updated) {
      throw new Error('Password not updated');
    }

    const status = 200;
    const resBody = {
      success: true,
      error: null,
      data: null,
      message: 'UpdatedPassword',
    };
    return { status, resBody };
  }
}
