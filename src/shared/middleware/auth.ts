import { authErrors } from '@seanboose/personal-website-api-types';
import type { Request, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config.js';

export const requireAuth: RequestHandler = (req, res, next) => {
  const accessToken = getAccessToken(req);
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
        message: 'Access token expired, please refresh auth',
      });
      return;
    } else if (err) {
      res.status(401).json({
        name: authErrors.accessTokenInvalid,
        message: 'Unauthorized, invalid access token',
      });
      return;
    }
    next();
  });
};

const getAccessToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return undefined;
  }
  return authHeader.substring(7);
};
