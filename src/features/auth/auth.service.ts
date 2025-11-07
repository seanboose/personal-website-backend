import jwt from 'jsonwebtoken';

import { config } from '../../shared/config.js';

export interface JwtRequestPayload {
  authRequestClientKey: string;
}

const generateToken = (payload: JwtRequestPayload, expiresIn: number) => {
  return jwt.sign(payload, config.jwtKey, { expiresIn });
};

// TODO making this super short for testing
const accessExpiresInS = 10;
// export const accessAgeS = 15 * 60; // 15 minutes
const refreshExpiresInS = 60 * 60 * 24 * 7; // 7 days

export const createAuthTokens = (client: string) => {
  const payload: JwtRequestPayload = { authRequestClientKey: client };
  return {
    accessToken: generateToken(payload, accessExpiresInS),
    expiresIn: accessExpiresInS,
    refreshToken: generateToken(payload, refreshExpiresInS),
    refreshExpiresIn: refreshExpiresInS,
  };
};
