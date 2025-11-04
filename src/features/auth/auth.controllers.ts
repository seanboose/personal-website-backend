import {
  authAccessTokenName,
  authErrors,
  authRefreshTokenName,
  authRequestClientKey,
  authRequestHeaderName,
} from '@seanboose/personal-website-api-types';
import type { RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../../shared/config.js';
import { readRefreshToken } from '../../shared/middleware/auth.js';
import {
  accessAgeS,
  generateAccessToken,
  generateRefreshToken,
  type JwtRequestPayload,
  refreshAgeS,
} from './auth.service.js';

export const grantAuth: RequestHandler = (req, res) => {
  const authRequestKey = req.headers[authRequestHeaderName];
  if (authRequestKey !== config.authRequestKey) {
    return res.status(403).json({
      error: authErrors.authKeyInvalid,
      message: 'Forbidden, invalid auth key',
    });
  }

  const client = req.body[authRequestClientKey];
  if (!client) {
    return res.status(400).json({
      error: authErrors.clientNotProvided,
      message: 'Bad Request, no client provided',
    });
  }

  createAndSetAuthCookies(res, client);
  res.status(200).json({ message: 'Auth granted' });
};

export const refreshAuth: RequestHandler = (req, res) => {
  const refreshToken = readRefreshToken(req);
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.jwtKey);
  } catch (err) {
    if (err instanceof Error && err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: authErrors.refreshTokenExpired,
        message: 'Session expired',
      });
    } else if (err) {
      return res.status(401).json({
        error: authErrors.refreshTokenInvalid,
        message: 'Invalid refresh token',
      });
    }
  }

  let client: string | undefined = undefined;
  if (typeof decoded !== 'undefined' && typeof decoded !== 'string') {
    client = decoded.authRequestClientKey;
  }
  if (typeof client === 'undefined') {
    return res.status(401).json({
      error: authErrors.refreshTokenInvalid,
      message: 'Refresh token provided no client',
    });
  }

  createAndSetAuthCookies(res, client);
  res.status(200).json({ message: 'Auth refreshed' });
};

const createAndSetAuthCookies = (res: Response, client: string) => {
  const payload: JwtRequestPayload = { authRequestClientKey: client };
  const newAccessToken = generateAccessToken(payload);
  res.cookie(authAccessTokenName, newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: accessAgeS * 1000,
  });
  const newRefreshToken = generateRefreshToken(payload);
  res.cookie(authRefreshTokenName, newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: refreshAgeS * 1000,
  });
};
