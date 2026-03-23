import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import bcrypt from 'bcrypt';
import { jwtTokensGenerator } from '@Utils/jwt';
import { AuthUserDTO } from '@dto/userAuth.dto';
import { IUserAuthService, IAuthService } from '@Interfaces/services/IAdminAuthService';
import { ApiResponse } from '@Constants/apiResponse';
import { AuthMessage, UserMessage } from '@Constants/resposeMessages';
import { TYPES } from '@DI/types';

import { AuthPayloadType, UserType } from '../types/auth.types';

@injectable()
export class UserAuthController {
  constructor(
    @inject(TYPES.UserAuthService)
    private _authService: IUserAuthService,

    @inject(TYPES.UserAuthService2)
    private _authService2: IAuthService,
  ) {}

  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userSchema, addressSchema } = AuthUserDTO.register(req);
      userSchema.password = await bcrypt.hash(userSchema.password, 10);

      const newUser = await this._authService.register(userSchema, addressSchema);

      if (!newUser) {
        const { status, resBody } = ApiResponse.failure(UserMessage.UserNotCreated);
        res.status(status).json(resBody);
        return;
      }

      //jwt *********
      const { token, refreshToken } = jwtTokensGenerator(newUser);

      res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, path: '/' }); //24h

      req.session.refreshToken = refreshToken;

      const { status, resBody } = ApiResponse.success(
        { id: newUser._id, email: newUser.email },
        AuthMessage.UserRegistered,
      );

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password }: AuthPayloadType = req.body;

      const role: UserType = req.headers.role as UserType;
      const payload: AuthPayloadType = {
        email,
        password,
        userType: role,
      };

      const { status, resBody } = await this._authService2.login(payload, req, res);

      res.status(status).json(resBody);
    } catch (err: unknown) {
      next(err);
    }
  }
}
