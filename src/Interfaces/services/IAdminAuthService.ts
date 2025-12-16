import { IUser } from "../../Models/userModel";
import { IAddress } from "../../Models/addressModel";

export interface IUserAuthService {
    register(useData: Partial<IUser>,address:Partial<IAddress>): Promise<IUser>;

    signIn(userData:Partial<IUser>):Promise<IUser|null>
}