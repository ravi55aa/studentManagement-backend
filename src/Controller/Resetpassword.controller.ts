
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





export class PasswordResetController{


    private fps:IForgotPasswordService;


    constructor(reset:IForgotPasswordService){
        this.fps=reset;
    }

    async verifyEmail(req:Request,res:Response,next:NextFunction){
        try{

            //de-structure dto
            const {email,model}=ForgotPasswordDTO.verifyEmail(req);
            
            //service call
            //* fPS = forgot-Password-Service
            const serviceRes:boolean|null=await this.fps.verifyEmail(model,email);
    
    
            //send response
            //* FPRB = forgot-Password-Response-Body
            const resBody:IResponse<boolean|null> = FPRB.handleVerifyEmailResBody(serviceRes);
            res
            .status(serviceRes?StatusCodes.OK:StatusCodes.NOT_FOUND)
            .json(resBody);


        } catch(err){
            next(err);
        }
    }
}