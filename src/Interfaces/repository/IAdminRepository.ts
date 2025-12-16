import { IAddress } from "../../Models/addressModel"
import { IUser } from "../../Models/userModel"
import { BaseRepository } from "../../Repository/BaseRepository"

export interface IUserRepository extends BaseRepository<IUser> {
    findByEmail(email:string) : Promise <IUser|null>,
    //create(address:Partial<IAddress>):Promise<IAddress>

    addAddress(address:IAddress):Promise<IAddress>
}
