import { parse } from 'cookie';
import type { Request, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config.js';

export const requireAuth: RequestHandler = (req, res, next) => {
  const accessToken = readAccessToken(req);
  if (!accessToken) {
    res.status(401).json({
      name: errorTokenNotProvided,
      message: 'Unauthorized, no token provided',
    });
    return;
  }

  jwt.verify(accessToken, config.jwtKey, (err: unknown) => {
    if (err instanceof Error && err.name === 'TokenExpiredError') {
      // TODO need to type these error responses, probably within api-types
      res.status(401).json({
        name: errorAuthTokenExpired,
        message: 'Auth token expired, please refresh',
      });
    } else if (err) {
      res.status(401).json({
        name: errorAuthTokenInvalid,
        message: 'Unauthorized, invalid token',
      });
      return;
    }
  });

  next();
};

const readAccessToken = (req: Request) => {
  return (
    req.cookies?.access_token || parse(req.headers.cookie || '').access_token
  );
};

export const readRefreshToken = (req: Request) => {
  return (
    req.cookies?.refresh_token || parse(req.headers.cookie || '').refresh_token
  );
};

// TODO need to standardize these around app
const errorTokenNotProvided = 'TOKEN_NOT_PROVIDED';
const errorAuthTokenExpired = 'AUTH_TOKEN_EXPIRED';
const errorAuthTokenInvalid = 'AUTH_TOKEN_INVALID';
export const errorRefreshTokenExpired = 'REFRESH_TOKEN_EXPIRED';
export const errorRefreshTokenInvalid = 'REFRESH_TOKEN_INVALID';
