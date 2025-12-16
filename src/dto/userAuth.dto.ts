
import { Request } from "express";
import { Document } from "mongoose";
import { IUser } from "../Models/userModel";
import { IAddress } from "../Models/addressModel";

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


