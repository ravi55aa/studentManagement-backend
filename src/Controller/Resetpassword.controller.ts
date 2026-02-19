
//* fPS = forgot-Password-Service

import { Request,Response,NextFunction } 
    from "express";
import { ForgotPasswordDTO } 
    from "../dto/forogotPasssword.dto";
import { IForgotPasswordService } 
    from "../Interfaces/services/IForgotPasswordService.";
import { FPRB } 
    from "../Utils/responseBody";
import { IResponse } 
    from "../Interfaces/IResponse";
import { StatusCodes } 
    from "../Constants/statusCodes";
import { ISchool } 
    from "../Models/schoolModel";
import { IUser } 
    from "../Models/userModel";
import { serviceReturnType } 
    from "../Constants/interfaces";
import { injectable,inject } from "tsyringe";
import { ForgotPasswordService } from "../Services/forgotPassword.service";

//todo
//For temporary purpose
//store the userId after email verification 
// at the localstorage
//Just to update the otp and new-password



@injectable()
export class PasswordResetController{

    constructor(
        @inject(ForgotPasswordService)
        private fps:IForgotPasswordService
    ){}


    async verifyEmail(req:Request,res:Response,next:NextFunction){
        try{

            const {email,model}=ForgotPasswordDTO.verifyEmail(req);
            
            
            //* fPS = forgot-Password-Service
            const serviceRes:ISchool|IUser|null=await this.fps.verifyEmail(model,email);//send the userId to the frontend
            
            //* FPRB = forgot-Password-Response-Body
            const resBody:IResponse<IUser|ISchool|null> = FPRB.handleVerifyEmailResBody(serviceRes);
            res
            .status(serviceRes?StatusCodes.OK:StatusCodes.NOT_FOUND)
            .json(resBody);


        } catch(err){
            next(err);
        }
    }


    async getOtp(req:Request,res:Response,next:NextFunction){
        try{
            const {status,resBody}:serviceReturnType=await this.fps.generateOtp(req);

            res.status(status).json(resBody);
        } catch(err){
            next(err);
        }
    }


    async otpVerification(req:Request,res:Response,next:NextFunction){
        try{
            const {status,resBody}:serviceReturnType=await this.fps.verifyOtp(req);

            res.status(status).json(resBody);
        } catch(err){
            next(err);
        }
    }



    async updateNewPassword(req:Request,res:Response,next:NextFunction){
        try{
            const {status,resBody}=await this.fps.updatePassword(req);

            res.status(status).json(resBody);

        }catch(err){
            next(err);
        }
    }

    async updatePasswordVersion2(req:Request,res:Response,next:NextFunction){
        try{
            const {status,resBody}=await this.fps.updatePasswordV2(req,res);

            res.status(status).json(resBody);

        }catch(err){
            next(err);
        }
    }
}