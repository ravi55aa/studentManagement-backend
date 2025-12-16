
import { IUserAuthService } 
    from "../Interfaces/services/IAdminAuthService"
import { IUserRepository } 
    from "../Interfaces/repository/IAdminRepository";
import userModel, { IUser } 
    from "../Models/userModel";
import {IAddress} 
    from "../Models/addressModel";
import { AddressFormatter, UserValidator } from "../Constants/userValidator";



export class UserAuthService implements IUserAuthService {
    
    constructor(
        private userRepository:IUserRepository,
    ){}



    async register(userData:IUser,address:IAddress){
        await UserValidator.ensureUserIsTaken(this.userRepository,userData.email);

        const createUser = await this.userRepository.create(userData);

        await this.userRepository.addAddress(
            {
                ...AddressFormatter.toPlain(address),
                userId:createUser._id,
                userType:"admin"
            }
        );
        return createUser;
    }



    async signIn(userData:IUser){
        try{
            const isUser:IUser|null= await this.userRepository.findOne({email:userData.email,password:userData.password});
            
            return isUser;
        } catch(err:any){
            console.log(err,{cause:err.message});
            throw new Error(err);
        }
    }
}


