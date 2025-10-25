import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../../shared/config.js';
import { readRefreshToken } from '../../shared/middleware/auth.js';
import {
  accessAgeS,
  generateAccessToken,
  generateRefreshToken,
  type JwtPayload,
  refreshAgeS,
} from './auth.service.js';

const authRequestHeader = 'internal-auth-key';
const authRequestClientKey = 'auth-request-client';

export const grantAuth: RequestHandler = (req, res) => {
  const authRequestKey = req.headers[authRequestHeader];
  if (authRequestKey !== config.authRequestKey) {
    return res.status(403).json({ message: 'Forbidden, invalid auth key' });
  }

  const client = req.body[authRequestClientKey];
  if (!client) {
    return res.status(400).json({ message: 'Bad Request, no client provided' });
  }

  const payload: JwtPayload = { authRequestClientKey: client };
  // TODO this was allowing me to pass a string. wtf
  const accessToken = generateAccessToken(payload);
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: accessAgeS * 1000,
  });

  const refreshToken = generateRefreshToken(payload);
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: refreshAgeS * 1000,
  });
  res.status(200).json({ message: 'Auth granted' });
};

export const refreshAuth: RequestHandler = (req, res) => {
  let client;
  console.log(req);
  const refreshToken = readRefreshToken(req);
  console.log(refreshToken);
  jwt.verify(refreshToken, config.jwtKey, (err: unknown, decoded: unknown) => {
    if (err instanceof Error && err.name === 'TokenExpiredError') {
      console.log('REFRESH_TOKEN_EXPIRED');
      return res
        .status(401)
        .json({ error: 'REFRESH_TOKEN_EXPIRED', message: 'Session expired' });
    } else if (err) {
      console.log('REFRESH_TOKEN_INVALID');
      return res.status(401).json({
        error: 'REFRESH_TOKEN_INVALID',
        message: 'Invalid refresh token',
      });
    }
    const payload = decoded as JwtPayload;
    console.log(decoded);
    client = payload.authRequestClientKey;
  });
  if (typeof client === 'undefined') {
    return res.status(401).json({
      error: 'REFRESH_TOKEN_INVALID',
      message: 'Refresh token provided no client',
    });
  }

  const payload: JwtPayload = { authRequestClientKey: client };
  // TODO this was allowing me to pass a string here too. wtf
  const newAccessToken = generateAccessToken(payload);
  res.cookie('access_token', newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: accessAgeS * 1000,
  });
  const newRefreshToken = generateRefreshToken(payload);
  res.cookie('refresh_token', newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: refreshAgeS * 1000,
  });
  res.status(200).json({ message: 'Auth refreshed' });
};
