
import { IUserAuthService } 
    from "../Interfaces/services/IAdminAuthService"
import { IUserRepository } 
    from "../Interfaces/repository/IAdminRepository";
import { IUser } 
    from "../Models/userModel";
import {IAddress} 
    from "../Models/addressModel";
import { AddressFormatter, UserValidator } 
    from "../Constants/userValidator";
import { Request,Response } 
    from "express";
import { handleJwtTokensGenerator, IJwtPayload} 
    from "../Utils/jwt";


export class UserAuthService implements IUserAuthService {
    
    constructor(
        private userRepository:IUserRepository,
    ){}



    async register(userData:IUser,address:IAddress){
        await UserValidator.ensureUserIsTaken(this.userRepository,userData.email);

        const createUser = await this.userRepository.create(userData);
        if(!createUser){
            throw new Error("Cant create the user");
        }

        await this.userRepository.addAddress(
            {
                ...AddressFormatter.toPlain(address),
                userId:createUser._id,
                userType:"Admin"
            }
        );
        return createUser;
    }



    async signIn(req:Request,res:Response){
        try{

            const userData:IUser=req.body;

            const isUser:IUser|null= await this.userRepository.findOne({email:userData.email,password:userData.password});

            //jwt ****
            if(isUser){
                const payload:IJwtPayload=
                {   userId:isUser?._id!,
                    role:"admin",
                    tenantId:null
                }

                handleJwtTokensGenerator(payload,req,res);
            }
            
            return isUser;
        } catch(err:any){
            console.log(err,{cause:err.message});
            throw new Error(err);
        }
    }

}


