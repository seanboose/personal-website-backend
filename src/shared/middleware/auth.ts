import { authErrors } from '@seanboose/personal-website-api-types';
import { parse } from 'cookie';
import type { Request, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config.js';

export const requireAuth: RequestHandler = (req, res, next) => {
  const accessToken = readAccessToken(req);
  if (!accessToken) {
    res.status(401).json({
      name: authErrors.accessTokenNotProvided,
      message: 'Unauthorized, no token provided',
    });
    return;
  }

  jwt.verify(accessToken, config.jwtKey, (err: unknown) => {
    if (err instanceof Error && err.name === 'TokenExpiredError') {
      res.status(401).json({
        name: authErrors.accessTokenExpired,
        message: 'Auth token expired, please refresh',
      });
    } else if (err) {
      res.status(401).json({
        name: authErrors.accessTokenInvalid,
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
