import mongoose, { FilterQuery, Schema } from "mongoose";
import { IForgotPasswordRepository } from "../Interfaces/repository/IForgotPassword.repository";
import { adminModel } from "../Models";
import { IOtp, OtpModel } from "../Models/otpModel";
import schoolModel, { ISchool } from "../Models/schoolModel";
import { IUser } from "../Models/userModel";
import { getUserModel } from "../Utils/userModelResolver";
import { UserRole } from "../types/auth.types";
import { injectable } from "tsyringe";



export const idToObjectId=(id:string)=>{
    return new Schema.Types.ObjectId(id);
}




@injectable()
export class ForgotPasswordRepository
    implements IForgotPasswordRepository
    {

        async findAdmin(email:string):Promise<IUser|null>{
            return await adminModel.findOne({email:email});
        }


        async findSchool(email:string):Promise<ISchool|null>{
            return await schoolModel.findOne({email:email});
        }


        async isOtpExpired(query:FilterQuery<IOtp>):Promise<IOtp|null>{
            return await OtpModel.findOne(query);
        }


        async storeOtp(id:string,otp:string):Promise<IOtp>{
            const newOtp=await OtpModel.create({
            id: idToObjectId(id),
            otp: otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), 
            });

            return newOtp;
        }


        async updatePassword<T>(role:UserRole, id: string, data: Partial<T>)
        : Promise<T | null> {
            try{
                const Model = getUserModel(role);
    
                const updated = await Model.findOneAndUpdate(
                    { _id:id },
                    { $set: data  },
                    {new:true}
                ).lean<T>().exec();
    
                return updated;
            } catch(err){
                console.log(err);
                throw new Error("Cant update the password");
            }
        }


        async findAndUpdateAdmin(id:string,newPassword:string):Promise<IUser|null>{
            return await adminModel.findOneAndUpdate({_id:id},{password:newPassword},{new:true});
        }


        async findAndUpdateSchool(id:string,newPassword:string):Promise<ISchool|null>{
            return schoolModel.findOneAndUpdate({_id:id},{password:newPassword},{new:true});
        }

    }