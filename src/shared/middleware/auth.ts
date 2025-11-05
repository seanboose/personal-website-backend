import {
  authAccessTokenName,
  authErrors,
  authRefreshTokenName,
} from '@seanboose/personal-website-api-types';
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
        message: 'Access token expired, please refresh auth',
      });
    } else if (err) {
      res.status(401).json({
        name: authErrors.accessTokenInvalid,
        message: 'Unauthorized, invalid access token',
      });
      return;
    }
  });

  next();
};

export const readAccessToken = (req: Request) => {
  return readCookieWithHeaderFallback(req, authAccessTokenName);
};

export const readRefreshToken = (req: Request) => {
  return readCookieWithHeaderFallback(req, authRefreshTokenName);
};

const readCookieWithHeaderFallback = (req: Request, cookieName: string) => {
  return (
    req.cookies?.[cookieName] || parse(req.headers.cookie || '')[cookieName]
  );
};
