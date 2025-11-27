// MongoUserRepository.ts
/*
import { IUserRepository } from './IUserRepository';
import { RegisterData, UserModel, User } from '../models/User'; 

export class MongoUserRepository implements IUserRepository {
    public async findByEmail(email: string): Promise<User | null> {
        // Direct DB Query: findOne is a Mongoose/ORM method
        return UserModel.findOne({ email }).exec();
    }

    public async create(userData: RegisterData): Promise<User> {
        const newUser = new UserModel(userData);
        await newUser.save();
        // Return a clean User object, not the full Mongoose document
        return newUser.toObject() as User; 
    }
}

*/