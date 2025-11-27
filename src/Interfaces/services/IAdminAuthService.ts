import { IUser } from "../../Models/userModel";

export interface IUserAuthService {
    registerUser(useData: Partial<IUser>): Promise<IUser>;
}

