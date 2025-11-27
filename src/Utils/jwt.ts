import { sign,verify,JwtPayload, JsonWebTokenError } from "jsonwebtoken";

import env from "../Config/env.config";

interface JwtUserPayload {
    userId: string;
    email?: string;
    role?: string;
}

export const generateAccessToken=(user:JwtUserPayload):string=>{
    return sign( user, env.JWT_ACCESS_TOKEN_SECRET,{
        expiresIn:2*60 //1h , env.JWT_TOKEN_EXPIRES_IN 
    });
}

export const generateRefreshToken=(user:JwtUserPayload):string=>{
    return sign( user, env.JWT_REFRESH_TOKEN_SECRET,{
        expiresIn:env.JWT_TOKEN_EXPIRES_IN
    });
}


export const verifyToken=(token:string,secret:string):JwtPayload | null =>{
    try{
        const decoded=verify(token,secret) as JwtPayload;

        return decoded;
        
    } catch(error:any){
        console.error('Invalid token',error,{cause:error?.message});
        return null
    }
}


export const refreshAccessToken=(refreshToken:string,user:JwtUserPayload):string|null=>{ 
    const decoded=verifyToken(refreshToken,env.JWT_REFRESH_TOKEN_SECRET);


    if(!decoded) {
        console.error('Refresh token invalid');
        return null;
    }

    return generateAccessToken(user); 
}








