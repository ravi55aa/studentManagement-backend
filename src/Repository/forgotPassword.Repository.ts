import { IForgotPasswordRepository } from "../Interfaces/repository/IForgotPassword.repository";
import { adminModel } from "../Models";
import schoolModel, { ISchool } from "../Models/schoolModel";
import { IUser } from "../Models/userModel";




export class ForgotPasswordRepository
    implements IForgotPasswordRepository
    {

        async findAdmin(email:string):Promise<IUser|null>{
            return await adminModel.findOne({email:email});
        }

        async findSchool(email:string):Promise<ISchool|null>{
            return await schoolModel.findOne({email:email});
        }
    }