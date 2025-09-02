import { parse } from 'cookie';
import type { Request, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config.js';
export const requireAuth: RequestHandler = (req, res, next) => {
  const accessToken = getAccessToken(req);
  if (!accessToken) {
    res.status(401).json({ message: 'Unauthorized, no token provided' });
    return;
  }

  jwt.verify(accessToken, config.jwtKey, (err: unknown) => {
    if (err) {
      res.status(401).json({ message: 'Unauthorized, invalid token' });
      return;
    }
  });

  next();
};

const getAccessToken = (req: Request) => {
  return (
    req.cookies?.access_token || parse(req.headers.cookie || '').access_token
  );
};
