import type { RequestHandler } from 'express';

import { generateToken, maxAgeS } from './auth.service.js';

const authRequestHeader = 'x-internal-auth-key';
const authRequestClientKey = 'auth-request-client';
const authRequestClientValue = 'personal-website-frontend';

export const grantAuth: RequestHandler = (req, res) => {
  const internalAuthKey = req.headers[authRequestHeader];
  if (internalAuthKey !== process.env.INTERNAL_AUTH_KEY) {
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
    maxAge: maxAgeS * 1000,
  });
  res.status(200).json({ message: 'Auth granted' });
};
