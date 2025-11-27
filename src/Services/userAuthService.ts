// bussinedd logic
// validate data

import { IUserAuthService } from "../Interfaces/services/IAdminAuthService"
import { IUserRepository } from "../Interfaces/repository/IAdminRepository";
import { IUser } from "../Models/userModel";


export class UserAuthService implements IUserAuthService{
    private userRepository:IUserRepository;
    
    constructor(userRepository:IUserRepository){
        this.userRepository=userRepository;
    }

    async registerUser(userData:IUser){

        //validate the data

        const isUser=await this.userRepository.findByEmail(userData.email);

        const createUser=await this.userRepository.createUser(userData);
        return createUser;
    }
}


