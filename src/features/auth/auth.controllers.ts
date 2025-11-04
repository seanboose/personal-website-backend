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

const authRequestHeader = 'internal-auth-key';
const authRequestClientKey = 'auth-request-client';
// TODO can these live in api-types
const accessTokenName = 'access_token';
const refreshTokenName = 'refresh_token';

export const grantAuth: RequestHandler = (req, res) => {
  const authRequestKey = req.headers[authRequestHeader];
  if (authRequestKey !== config.authRequestKey) {
    return res.status(403).json({ message: 'Forbidden, invalid auth key' });
  }

  const client = req.body[authRequestClientKey];
  if (!client) {
    return res.status(400).json({ message: 'Bad Request, no client provided' });
  }

  createAndSetAuthCookies(res, client);
};

export const refreshAuth: RequestHandler = (req, res) => {
  const refreshToken = readRefreshToken(req);
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.jwtKey);
  } catch (err) {
    if (err instanceof Error && err.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ error: 'REFRESH_TOKEN_EXPIRED', message: 'Session expired' });
    } else if (err) {
      return res.status(401).json({
        error: 'REFRESH_TOKEN_INVALID',
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
      error: 'REFRESH_TOKEN_INVALID',
      message: 'Refresh token provided no client',
    });
  }

  createAndSetAuthCookies(res, client);
};

const createAndSetAuthCookies = (res: Response, client: string) => {
  const payload: JwtRequestPayload = { authRequestClientKey: client };
  const newAccessToken = generateAccessToken(payload);
  res.cookie(accessTokenName, newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: accessAgeS * 1000,
  });
  const newRefreshToken = generateRefreshToken(payload);
  res.cookie(refreshTokenName, newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: refreshAgeS * 1000,
  });
  res.status(200).json({ message: 'Auth refreshed' });
};
