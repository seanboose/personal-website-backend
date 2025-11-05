import {
  authErrors,
  authRequestClientKey,
  authRequestHeaderName,
} from '@seanboose/personal-website-api-types';
import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../../shared/config.js';
import { readRefreshToken } from '../../shared/middleware/auth.js';
import {
  generateAccessToken,
  generateRefreshToken,
  type JwtRequestPayload,
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

  res.status(200).json(createAuthTokens(client));
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

  res.status(200).json(createAuthTokens(client));
};

const createAuthTokens = (client: string) => {
  const payload: JwtRequestPayload = { authRequestClientKey: client };
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};
