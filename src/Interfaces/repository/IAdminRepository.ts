import { IUser } from "../../Models/userModel"

export interface IUserRepository{
    
    findByEmail(email:string) : Promise <IUser|null>,

    createUser(userData:IUser):Promise<IUser>
}
