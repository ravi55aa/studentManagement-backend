import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from '../Constants/statusCodes';
import { IResponse } from '../Interfaces/IResponse';
import { IUser } from '../Models/userModel';
import { jwtTokensGenerator } from '../Utils/jwt';
import { AuthUserDTO } from '../dto/userAuth.dto';
import { handleResponseBody } from '../Utils/responseBody';
import { injectable, inject } from 'tsyringe';
import { UserAuthService } from '../Services/userAuthService';
import bcrypt from 'bcrypt';

@injectable()
export class UserAuthController {
  constructor(
    @inject(UserAuthService)
    private authService: UserAuthService,
  ) {}

  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let { userSchema, addressSchema } = AuthUserDTO.register(req);
      userSchema.password = await bcrypt.hash(userSchema.password, 10);

      const newUser = await this.authService.register(userSchema, addressSchema);
      if (!newUser) {
        throw new Error('Cant register new user');
      }

      //jwt *********
      const { token, refreshToken } = jwtTokensGenerator(newUser);

      res.cookie('token', token, { httpOnly: true, maxAge: 2 * 60 * 1000, path: '/' });

      req.session.refreshToken = refreshToken;

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'User created successfully',
        data: { id: newUser._id, email: newUser.email },
        error: null,
      });
    } catch (err: any) {
      next(err);
    }
  }

  public async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, resBody } = await this.authService.signIn(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }
}
