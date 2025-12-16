import { NextFunction, Request } from "express";





    export class ForgotPasswordDTO{
        
        static verifyEmail(req:Request){
            
            const {email,model}=req.query
            if(typeof email!=="string" || typeof model !=="string"){
                throw new Error("invalid query type");
            }

            return {email,model};
            
        }
    }