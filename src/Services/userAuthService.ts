import logger from '../Utils/logger';

import { IUserAuthService } from '../Interfaces/services/IAdminAuthService';
import { IUser } from '../Models/userModel';
import { IAddress } from '../Models/addressModel';
import { AddressFormatter, UserValidator } from '../Constants/userValidator';
import { Request, Response } from 'express';
import { handleJwtTokensGenerator, IJwtPayload } from '../Utils/jwt';
import { injectable, inject } from 'tsyringe';
import { UserRepository } from '../Repository/userRepository';
import bcrypt from 'bcrypt';
import { ApiResponse } from '../Constants/apiResponse';

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
      let userData = req.body;

      const isUser: IUser | null = await this.userRepository.findOne({
        email: userData.email,
      });

      if (!isUser) {
        return ApiResponse.notFound('AdminNotFound, invalid credentials');
      }

      const comparePasswords: boolean = await bcrypt.compare(userData.password, isUser.password!);

      if (!comparePasswords) {
        return ApiResponse.notFound('AdminNotFound, Password is incorrect');
      }
      const payload: IJwtPayload = { userId: isUser._id!, role: 'Admin', tenantId: null };
      handleJwtTokensGenerator(payload, req, res);

      return ApiResponse.success(isUser, 'Admin Login successfully');
    } catch (err: unknown) {
      logger.error(err);
      throw new Error('Failed to sign in', { cause: err });
    }
  }
}
