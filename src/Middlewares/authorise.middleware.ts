import { Request, Response, NextFunction } from 'express';
import { verifyToken, refreshAccessToken } from '../Utils/jwt';
import { env } from '../Config';
import handleErrorsMiddleware from './error.middleware';
import logger from '../Utils/logger';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token; //expired token back-listing

    let decoded = verifyToken(token, env.JWT_ACCESS_TOKEN_SECRET);
    req.user = decoded || {};

    if (decoded) return next();

    const refreshToken = req.session.refreshToken;
    // console.log("session id:", req.sessionID);
    // console.log("refresh token:", req.session.refreshToken);
    // console.log("full session:", req.session);

    if (!refreshToken) {
      throw new Error('Your session has ended, kindly re-login @authMiddleware');
    }

    const newToken = refreshAccessToken(refreshToken);
    if (!newToken) throw new Error("Can't generate new token from rToken");

    res.cookie('token', newToken, {
      httpOnly: true,
      maxAge: 2 * 60 * 1000, //can't set the env.token.expiryTime;
    });

    decoded = verifyToken(newToken, env.JWT_ACCESS_TOKEN_SECRET);
    req.user = decoded || {};

    logger.info('NewTokenGenerated🆕🎫');
    next();
  } catch (err: any) {
    logger.error('AUTH MIDDLEWARE ERROR:', err.message);
    return handleErrorsMiddleware(err, req, res, next);
  }
};
