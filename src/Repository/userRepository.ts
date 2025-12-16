import { FilterQuery } from "mongoose";
import { IUserRepository } from "../Interfaces/repository/IAdminRepository";
import { addressModel, adminModel } from "../Models";
import { IAddress } from "../Models/addressModel";
import { IUser } from "../Models/userModel";
import { BaseRepository } from "./BaseRepository";



export class UserRepository 
    extends BaseRepository<IUser>
    implements IUserRepository
    {

    constructor(){
        super(adminModel);
    }


    public async findByEmail(email:string){
        return this.model.findOne({email});
    }

    public async addAddress(addressData: IAddress): Promise<IAddress> {
        const newUserAddress=new addressModel(addressData);
        await newUserAddress.save();
        return newUserAddress; 
    }
}