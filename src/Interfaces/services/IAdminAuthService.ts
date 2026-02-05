import { IUser } 
    from "../../Models/userModel";
import { IAddress } 
    from "../../Models/addressModel";
import { Request,Response } 
    from "express";


export interface IUserAuthService {
    register(useData: Partial<IUser>,address:Partial<IAddress>): Promise<IUser|null>;

    signIn(req:Request,res:Response):Promise<IUser|null>
}