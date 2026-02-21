import { sign, verify, JwtPayload, SignOptions } from 'jsonwebtoken';

import { env } from '../Config';
import { Types } from 'mongoose';
import { IUser } from '../Models/userModel';
import { TGeneratesTokens } from '../types';
import { JwtROle } from '../types/jwtRole';
import { Request, Response } from 'express';

export interface IJwtPayload {
  userId: string | Types.ObjectId | null;
  tenantId?: string | null | Types.ObjectId;
  role?: JwtROle;
} // update types, keep only necessary one;

export const generateAccessToken = (user: IJwtPayload): string => {
  if (!env.JWT_ACCESS_TOKEN_SECRET) {
    throw new Error('Missing JWT refresh secret');
  }

  if (!env.JWT_TOKEN_EXPIRES_IN) {
    throw new Error('Missing JWT refresh expires value');
  }

  return sign(user, env.JWT_ACCESS_TOKEN_SECRET!, {
    expiresIn: env.JWT_TOKEN_EXPIRES_IN!,
  } as SignOptions);
};

export const generateRefreshToken = (user: IJwtPayload): string => {
  if (!env.JWT_REFRESH_TOKEN_SECRET) {
    throw new Error('Missing JWT refresh secret');
  }

  if (!env.JWT_REFRESH_TOKEN_EXPIRES_IN) {
    throw new Error('Missing JWT refresh expires value');
  }

  return sign(user, env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  } as SignOptions);
};

export const verifyToken = (token: string, secret: string): JwtPayload | null => {
  try {
    if (!token) return null;
    const decoded = verify(token, secret) as JwtPayload;

    return decoded;
  } catch (error: any) {
    return null;
  }
};

export const refreshAccessToken = (refreshToken: string): string | null => {
  const decoded = verifyToken(refreshToken, env.JWT_REFRESH_TOKEN_SECRET!);

  const user: IJwtPayload = {
    userId: decoded?.userId,
    tenantId: decoded?.tenantId,
    role: decoded?.role,
  };

  if (!decoded) {
    console.error('Refresh token invalid', decoded);
    return decoded;
  }

  return generateAccessToken(user);
};

export const jwtTokensGenerator = (userCred: IUser): TGeneratesTokens => {
  const jwtData: IJwtPayload = { userId: userCred._id, tenantId: null, role: 'Admin' };

  const token = generateAccessToken(jwtData);
  const refreshToken = generateRefreshToken(jwtData);

  return { token, refreshToken };
};

export const jwtTokensGeneratorForAll = (payload: IJwtPayload): TGeneratesTokens => {
  const token = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { token, refreshToken };
};

export const handleJwtTokensGenerator = (
  payload: IJwtPayload,
  req: Request,
  res: Response,
): void => {
  const { token, refreshToken } = jwtTokensGeneratorForAll(payload);

  res.cookie('token', token, { httpOnly: true, maxAge: 10 * 60 * 1000, path: '/' });

  req.session.refreshToken = refreshToken;
};

export const handleTokenVerification = (req: Request, res: Response) => {
  let token = req.cookies.token;

  let decoded = verifyToken(token, env.JWT_ACCESS_TOKEN_SECRET!);

  if (decoded == null) {
    const refreshToken = req.session.refreshToken;

    if (!refreshToken) {
      throw new Error('Your session has ended, Kindly re-login @jwt');
    }

    token = refreshAccessToken(refreshToken!);

    res.cookie('token', token, { httpOnly: true, maxAge: 10 * 60 * 1000, path: '/' });

    decoded = verifyToken(token, env.JWT_ACCESS_TOKEN_SECRET!);

    if (!decoded) {
      throw new Error('AUTH_ERROR: Token refresh failed');
    }
  }

  return decoded;
};
