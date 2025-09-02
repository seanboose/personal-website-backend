import { parse } from 'cookie';
import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { config } from './config.js';

const maxAgeS = 15 * 60; // 15 minutes
const maxAgeMs = maxAgeS * 1000;

const authRequestHeader = 'x-internal-auth-key';
const authRequestClientKey = 'auth-request-client';
const authRequestClientValue = 'personal-website-frontend';

export const generateToken = (payload: object) => {
  return jwt.sign(payload, config.jwtKey, { expiresIn: maxAgeS });
};

export const grantAuth: RequestHandler = (req, res) => {
  const key = req.headers[authRequestHeader];
  if (key !== process.env.INTERNAL_AUTH_KEY) {
    return res.status(403).json({ message: 'Forbidden, invalid auth key' });
  }

  const client = req.body[authRequestClientKey];
  if (client !== authRequestClientValue) {
    return res.status(400).json({ message: 'Bad Request, invalid client' });
  }

  const token = generateToken({ authRequestClientKey: client }); // TODO need a useful payload?
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: maxAgeMs,
  });
  res.status(200).json({ message: 'Auth granted' });
};

export const requireAuth: RequestHandler = (req, res, next) => {
  const token =
    req.cookies?.access_token || parse(req.headers.cookie || '').access_token;
  if (!token) {
    res.status(401).json({ message: 'Unauthorized, no token provided' });
    return;
  }

  jwt.verify(token, config.jwtKey, (err: unknown) => {
    if (err) {
      res.status(401).json({ message: 'Unauthorized, invalid token' });
      return;
    }
  });
  next();
};
