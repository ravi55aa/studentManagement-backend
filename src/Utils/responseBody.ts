import { AddressMessage, AuthMessage, DocumentMessage } 
    from "../Constants/resposeMessages";
import { IUser } 
    from "../Models/userModel";
import { Response,Request } 
    from "express";
import { jwtTokensGenerator } 
    from "./jwt";
import { IResponse } 
    from "../Interfaces/IResponse";
import { IAddress } 
    from "../Models/addressModel";
import { IDocument } from "../Models/documentModel";




export const handleResponseBody = 
(signInUser: IUser | null,res:Response,req:Request)=>
    {
        if(signInUser===null){
            return {
                success:false,
                    message:AuthMessage.InvalidCredentials,
                        data:signInUser,
                            error:AuthMessage.InvalidCredentials
            }
        }

        const {token,refreshToken} =
                jwtTokensGenerator(signInUser);

        res.cookie("token",
                token,
                    {httpOnly:true,maxAge:2*60*1000,path:"/"});

        req.session.refreshToken=refreshToken; 

        return {
            success:true,
                message:AuthMessage.UserLoggedIn,
                    data:signInUser,
                        error:null
        }
    }





    export const validateResponseBody=
    (payload:string)
    :IResponse<typeof payload|null>=>{
        return {
                success: true, 
                message: "School created successfully",
                data:payload,
                error: null
            };
    }




    export const handleSchoolRB=
    (address:IAddress):IResponse<IAddress>=>{
        return {
            success:true,
            data:address,
            error:null,
            message:AddressMessage.AddressAdded
        }
    }




    export const handleSchoolResBody=(serviceResp:any)=>{
        return {
            success:true,
            data:serviceResp,
            error:serviceResp ?null:AuthMessage.InvalidCredentials,
            message:serviceResp ?AuthMessage.UserLoggedIn:  AuthMessage.InvalidCredentials
        }
    }




export const handleDocRespBody 
    = (payload:Promise<IDocument|null>):IResponse<Promise<IDocument|null>>=>{
        return{
            success:true,
            data:payload,
            error:null,
            message:DocumentMessage.DocumentAdded
        }
}


//* FPRB = forgot-Password-Response-Body
export class FPRB{
    static handleVerifyEmailResBody(isVerified:boolean|null):IResponse<boolean|null>{
        return  {
            success:isVerified?true:false,
            data:isVerified,
            error:null,
            message:DocumentMessage.DocumentAdded
        }
    }
}