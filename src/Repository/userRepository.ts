import { IUserRepository } from "../Interfaces/repository/IAdminRepository";
import userModel, { IUser } from "../Models/userModel";



class userRepository implements IUserRepository{
    
    public async findByEmail(email: string): Promise<IUser | null> {
        return userModel.findOne({email}).exec();
    }

    async createUser(userData: IUser): Promise<IUser> {
        const newUser=new userModel({userData});
        await newUser.save();
        return newUser; 
    }
}