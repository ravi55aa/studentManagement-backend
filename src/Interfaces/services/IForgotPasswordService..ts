
import { IOtp } 
    from "../../Models/otpModel";
import { Request,Response } 
    from "express";
import { ISchool } from "../../Models/schoolModel";
import { IUser } from "../../Models/userModel";
import { serviceReturnType } from "../../Constants/interfaces";

export interface IForgotPasswordService {

    verifyEmail(model:string,email:string):Promise<ISchool|IUser|null>

    generateOtp(req:Request):Promise<serviceReturnType>

    findValidOtp(email:string,otp:string):Promise<IOtp|null>

    verifyOtp(req:Request):Promise<serviceReturnType>

    updatePassword(req:Request):Promise<serviceReturnType>

    updatePasswordV2(req:Request,res:Response):Promise<serviceReturnType>
}