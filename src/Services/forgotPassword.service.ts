import { Model } 
    from "mongoose";
import { Databases } 
    from "../Constants/passwordChange";
import { IForgotPasswordService } 
    from "../Interfaces/services/IForgotPasswordService.";
import { adminModel } 
    from "../Models";
import schoolModel, { ISchool } 
    from "../Models/schoolModel";
import { IUser } 
    from "../Models/userModel";
import { IForgotPasswordRepository } from "../Interfaces/repository/IForgotPassword.repository";










export class ForgotPasswordService implements IForgotPasswordService{
    
    private repository:IForgotPasswordRepository;
    
    constructor(repository:IForgotPasswordRepository){
        this.repository=repository;
    }



    async verifyEmail(modelName:string,email:string):Promise<null|boolean>{

        if(modelName=="admin"){
            return Boolean(this.repository?.findAdmin(email)); //repository call
        } else if(modelName==="school"){
            return Boolean(this.repository?.findSchool(email)); //repository call
        }
        
        return null;
    }
}

