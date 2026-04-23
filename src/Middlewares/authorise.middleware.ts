import { Request, Response, NextFunction } from 'express';

import { verifyToken, refreshAccessToken } from '../Utils/jwt';
import { env } from '../Config';
import logger from '../Utils/logger';
import { StatusCodes } from '../Constants/statusCodes';
import { AuthMessage } from '../Constants/resposeMessages';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.token; //expired token back-listing

    if (!accessToken) {
      logger.warn('Access token missing', {
        path: req.originalUrl,
      });

      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'User Unauthorized',
      });
    }

    /* ========Try Verify Access Token========= */
    try {
      
      const decoded = verifyToken(accessToken, env.JWT_ACCESS_TOKEN_SECRET!);

      if (decoded && req.user) {
        req.user.role = decoded.role;
        req.user.userId = decoded.userId;
        req.user.tenantId = decoded.tenantId;
      }

      return next();

    } catch (accessError: unknown) {
      /* Token expired ; try refresh */
      if (accessError instanceof Error && accessError.name !== 'TokenExpiredError') {
        logger.warn(AuthMessage.InvalidAccessToken, {
          error: accessError.message,
        });

        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid authentication token',
        });
      }
    }

    /* ===========Refresh Flow========== */
    const refreshToken = req.session?.refreshToken;

    if (!refreshToken) {
      logger.warn('Refresh token missing');

      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Session expired. Please login again.',
      });
    }

    const newAccessToken = refreshAccessToken(refreshToken);

    if (!newAccessToken) {
      logger.warn('Failed to generate new access token');

      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Session expired. Please login again.',
      });
    }

    /* ===========Set New Access Token Cookie============*/
    res.cookie('token', newAccessToken, {
      //domain:'.localhost',
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 2 * 60 * 1000, // 2 minutes (consider moving to env)
    });

    const decoded = verifyToken(newAccessToken, env.JWT_ACCESS_TOKEN_SECRET!);

    if (decoded && req.user) {
      req.user.role = decoded.role;
      req.user.userId = decoded.userId;
      req.user.tenantId = decoded.tenantId;
    }

    logger.info('NewTokenGenerated🆕🎫', {
      userId: decoded?.id,
    });

    return next();
  } catch (error) {
    logger.error('Auth middleware unexpected error', {
      error: error,
      path: req.originalUrl,
    });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal authentication error',
    });
  }
};
