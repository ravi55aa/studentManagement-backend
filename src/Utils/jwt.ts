import { sign,verify,JwtPayload } from "jsonwebtoken";

import env from "../Config/env.config";
import { Types } from "mongoose";
import { decode } from "punycode";
import { IUser } from "../Models/userModel";
import { TGeneratesTokens } from "../types";


export interface IJwtPayload  {
    userId: Types.ObjectId|null;
    tenantId?: string|null|Types.ObjectId;
    role?: string|null;
} //update types, keep only necessary one;


export const generateAccessToken=(user:IJwtPayload)=>{
        return sign( user, env.JWT_ACCESS_TOKEN_SECRET,{
            expiresIn:env.JWT_TOKEN_EXPIRES_IN
        });
}


export const generateRefreshToken = 
    (user:IJwtPayload):string=>{
        return sign( user, env.JWT_REFRESH_TOKEN_SECRET,{
            expiresIn:env.JWT_REFRESH_TOKEN_EXPIRES_IN
        });
}


export const verifyToken =
        (token:string,secret:string):JwtPayload=>{
    try{
        const decoded=verify(token,secret) as JwtPayload;

        return decoded;
        
    } catch(error:any){
        console.error('Invalid token',error,{cause:error?.message});
        throw new Error("Invalid token");
    }
}


export const refreshAccessToken = 
    (refreshToken:string):string=>{ 
        const decoded=verifyToken(refreshToken,env.JWT_REFRESH_TOKEN_SECRET);

        const user:IJwtPayload={
            userId:decoded.userId,
            tenantId: decoded.tenantId,
            role: decoded.role,
        }

        if(!decoded) {
            console.error('Refresh token invalid',decoded);
            return decoded;
        }

        return generateAccessToken(user); 
}

export const jwtTokensGenerator=(userCred:IUser):TGeneratesTokens=>{
        const jwtData:IJwtPayload=
                { userId:userCred._id,tenantId:null,role:"admin"}

        const token=
            generateAccessToken(jwtData);
        const refreshToken=
            generateRefreshToken(jwtData);

        return {token,refreshToken};
    }






