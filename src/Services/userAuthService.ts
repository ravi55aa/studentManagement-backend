import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import bcrypt from 'bcrypt';
import { serviceReturnType } from '@Constants/interfaces';
import { ITeacherRepo } from '@Interfaces/repository/ITeacherRepo';
import { TYPES } from '@DI/types';
import logger from '@Utils/logger';
import { IAuthService, IUserAuthService } from '@Interfaces/services/IAdminAuthService';
import { IUser } from '@Models/userModel';
import { IAddress } from '@Models/addressModel';
import { AddressFormatter, UserValidator } from '@Constants/userValidator';
import { handleJwtTokensGenerator, IJwtPayload } from '@Utils/jwt';
import { ApiResponse } from '@Constants/apiResponse';
import { ISuperAdminRepository, IUserRepository } from '@Interfaces/repository/IAdminRepository';
import { AuthMessage, UserMessage } from '@Constants/resposeMessages';
import { IStudentRepository } from '@Interfaces/repository/IStudentRepository';

import { AuthPayloadType, IRepositoryMap } from '../types/auth.types';


@injectable()
export class UserAuthService implements IUserAuthService {
  constructor(
    @inject(TYPES.UserRepository)
    private _userRepository: IUserRepository,
  ) {}

  async register(userData: Partial<IUser>, address: Partial<IAddress>) {
    await UserValidator.ensureUserIsTaken(this._userRepository, userData.email!);

    const createUser = await this._userRepository.create(userData);
    if (!createUser) {
      throw new Error(UserMessage.UserNotCreated);
    }

    await this._userRepository.addAddress({
      ...AddressFormatter.toPlain(address),
      userId: createUser._id,
      userType: 'Admin',
    });
    return createUser;
  }

  async signIn(req: Request, res: Response) {
    try {
      const userData = req.body;

      const isUser: IUser | null = await this._userRepository.findOne({
        email: userData.email,
      });

      if (!isUser) {
        return ApiResponse.notFound(UserMessage.UserNotFound);
      }

      const comparePasswords: boolean = await bcrypt.compare(userData.password, isUser.password!);

      if (!comparePasswords) {
        return ApiResponse.notFound(AuthMessage.InvalidCurrentPassword);
      }
      const payload: IJwtPayload = { userId: isUser._id!, role: 'Admin', tenantId: null };
      handleJwtTokensGenerator(payload, req, res);

      return ApiResponse.success(isUser, AuthMessage.UserLoggedIn);
    } catch (err: unknown) {
      logger.error(err);
      throw new Error(AuthMessage.InvalidCredentials, { cause: err });
    }
  }
}

@injectable()
export class UserAuthServiceV2 implements IAuthService {
  private _repositoryMap: IRepositoryMap = {
    Teacher: null,
    Admin: null,
    School: null,
    Student: null,
    SuperAdmin: null,
  };

  constructor(
    @inject(TYPES.TeacherRepository)
    private _teacherRepo: ITeacherRepo,

    @inject(TYPES.UserRepository)
    private _adminRepo: IUserRepository,

    @inject(TYPES.SuperAdminRepository)
    private _superAdminRepo: ISuperAdminRepository,

    @inject(TYPES.StudentRepository)
    private _studentRepo: IStudentRepository,
  ) {
    this._repositoryMap.Teacher = this._teacherRepo;
    this._repositoryMap.Admin = this._adminRepo;
    this._repositoryMap.Student = this._studentRepo;
    this._repositoryMap.SuperAdmin = this._superAdminRepo;
  }

  async login(payload: AuthPayloadType, req: Request, res: Response): Promise<serviceReturnType> {

    const { email, password, userType } = payload;

    if (!email || !password || !userType) {
      return ApiResponse.badRequest(AuthMessage.InvalidCredentials);
    }

    const repo = this._repositoryMap?.[userType];

    if (!repo) {
      return ApiResponse.badRequest(AuthMessage.InvalidUser);
    }

    let user:any = null;

    // Teacher login
    if (userType === 'Teacher') {
      user = await repo.findOne({ email, phone: password });
    }
    // Admin or School login
    else {
      user = await repo.findOne({ email });

      if (!user) {
        return ApiResponse.failure(AuthMessage.not_Found);
      }

      const isValid = await bcrypt.compare(password, user.password  );

      if (!isValid) {
        return ApiResponse.badRequest(AuthMessage.InvalidCredentials);
      }
    }

    if (!user) {
      return ApiResponse.failure(AuthMessage.not_Found);
    }

    // determine tenantId
    let tenantId: string | null = null;

    if (userType === 'School') {
      tenantId = user._id;
    }

    tenantId = user.tenantId;

    const tokenPayload: IJwtPayload = {
      userId: user._id,
      role: userType,
      tenantId: tenantId || user._id,
    };

    handleJwtTokensGenerator(tokenPayload, req, res);

    return ApiResponse.success(user, AuthMessage.UserLoggedIn);
  }
}
