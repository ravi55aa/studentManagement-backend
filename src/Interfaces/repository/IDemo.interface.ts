/** 


import { RegisterData, User } from '../models/User';

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>; 
    create(userData: RegisterData): Promise<User>;
}

*/ 