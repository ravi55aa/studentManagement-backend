
import { Request } from "express";

export class AuthUserDTO{
    static register(req:Request){
        const {
                name,
                email,
                password,
                profile,
                street,
                city,
                state,
                zip,
                country,
                phone,
            }=req.body;

        const userSchema
        =
        {name,email,password,phone,profile}; //give the type check

        const addressSchema =
        {street,city,state,zip,country}//give the type check

        return {userSchema,addressSchema};
    }

}


