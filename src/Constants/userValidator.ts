import { IUserRepository } from "../Interfaces/repository/IAdminRepository"
import { IAddress } from "../Models/addressModel";

export class UserValidator{
    static async ensureUserIsTaken(repository:IUserRepository,field:string){
        const existing= await repository.findByEmail(field);
        if(existing) throw new Error("User already exist");
    }
}


export class AddressFormatter {
    static toPlain(address:IAddress){
        return (address && typeof address.toObject === "function") 
        ? address.toObject()
        : address;
    }
}


