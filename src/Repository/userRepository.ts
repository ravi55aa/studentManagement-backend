import { injectable } from 'tsyringe';

import { IUserRepository } from '../Interfaces/repository/IAdminRepository';
import { addressModel, adminModel } from '../Models';
import { IAddress } from '../Models/addressModel';
import { IUser } from '../Models/userModel';
import logger from '../Utils/logger';

import { BaseRepository } from './BaseRepository';

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(adminModel);
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    try {
      if (!email) return null;

      return await this.model.findOne({ email }).lean<IUser>();
    } catch (error) {
      logger.error('Error finding user by email:', error);
      return null;
    }
  }

  public async addAddress(addressData: IAddress): Promise<IAddress | null> {
    try {
      const newUserAddress = await addressModel.create(addressData);
      return newUserAddress;
    } catch (error) {
      logger.error('Error adding user address:', error);
      return null;
    }
  }
}
