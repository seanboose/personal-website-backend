import type { RequestHandler } from 'express';

import { config } from '../../shared/config.js';
import { generateToken, maxAgeS } from './auth.service.js';

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

  const token = generateToken({ authRequestClientKey: client }); // TODO need a useful payload?
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: maxAgeS * 1000,
  });
  res.status(200).json({ message: 'Auth granted' });
};
