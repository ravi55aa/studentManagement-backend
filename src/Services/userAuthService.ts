import logger from '../Utils/logger';

import { IUserAuthService } from '../Interfaces/services/IAdminAuthService';
import { IUser } from '../Models/userModel';
import { IAddress } from '../Models/addressModel';
import { AddressFormatter, UserValidator } from '../Constants/userValidator';
import { Request, Response } from 'express';
import { handleJwtTokensGenerator, IJwtPayload } from '../Utils/jwt';
import { injectable, inject } from 'tsyringe';
import { UserRepository } from '../Repository/userRepository';
import bcrypt from "bcrypt";


@injectable()
export class UserAuthService implements IUserAuthService {
  constructor(
    @inject(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async register(userData: Partial<IUser>, address: Partial<IAddress>) {
    await UserValidator.ensureUserIsTaken(this.userRepository, userData.email!);

    const createUser = await this.userRepository.create(userData);
    if (!createUser) {
      throw new Error('Cant create the user');
    }

    await this.userRepository.addAddress({
      ...AddressFormatter.toPlain(address),
      userId: createUser._id,
      userType: 'Admin',
    });
    return createUser;
  }

  async signIn(req: Request, res: Response) {
    try {
      let userData: IUser = req.body;
      const hashedPassword=await bcrypt.hash(userData.password,10);
      userData.password = hashedPassword;

      const isUser: IUser | null = await this.userRepository.findOne({
        email: userData.email,
        password: userData.password
      });

      //jwt ****
      if (isUser) {
        const payload: IJwtPayload = { userId: isUser._id!, role: 'admin', tenantId: null };

        handleJwtTokensGenerator(payload, req, res);
      }

      return isUser;
    } catch (err: unknown) {
      logger.error(err);
      throw new Error('Failed to sign in', { cause: err });
    }
  }
}
