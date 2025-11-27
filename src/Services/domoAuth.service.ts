// AuthService.ts
/*
import { IAuthService } from './IAuthService';
import { IUserRepository } from '../repositories/IUserRepository';
import { RegisterData, User } from '../models/User'; 

export class AuthService implements IAuthService {
    // Service depends on the Repository INTERFACE
    constructor(private userRepository: IUserRepository) {}

    public async registerUser(userData: RegisterData): Promise<User> {
        // 1. **BUSINESS RULE**: Check if user already exists
        const existingUser = await this.userRepository.findByEmail(userData.email);

        if (existingUser) {
            // Throw a specific error that the Controller can catch and translate to HTTP 409
            throw new Error("USER_ALREADY_EXISTS"); 
        }

        // 2. **BUSINESS RULE**: Create the user (Password hashing would happen here or in the model)
        const newUser = await this.userRepository.create(userData);

        // 3. **BUSINESS RULE**: You might add logic here to send a welcome email, etc.

        return newUser;
    }
}
*/