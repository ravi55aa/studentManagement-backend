import { Model } from "mongoose";
import { ISchool } from "../../Models/schoolModel";
import { IUser } from "../../Models/userModel";

export interface IForgotPasswordService{
    verifyEmail(model:string,email:string):Promise<boolean|null>
}