import { Request, Response } from 'express';

import { IUser } from '../../Models/userModel';
import { IAddress } from '../../Models/addressModel';
import { serviceReturnType } from '../../Constants/interfaces';
import { AuthPayloadType } from '../../types/auth.types';

export interface IUserAuthService {
  register(useData: Partial<IUser>, address: Partial<IAddress>): Promise<IUser | null>;

  signIn(req: Request, res: Response): Promise<serviceReturnType>;
}

export interface IAuthService {
  login(payload: AuthPayloadType, req: Request, res: Response): Promise<serviceReturnType>;
}
