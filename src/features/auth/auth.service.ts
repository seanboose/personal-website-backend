import jwt from 'jsonwebtoken';

import { config } from '../../shared/config.js';

export interface JwtRequestPayload {
  authRequestClientKey: string;
}

const generateToken = (payload: JwtRequestPayload, expiresIn: number) => {
  return jwt.sign(payload, config.jwtKey, { expiresIn });
};

export const createAuthTokens = (client: string) => {
  const payload: JwtRequestPayload = { authRequestClientKey: client };
  return {
    accessToken: generateToken(payload, config.authAccessTokenExpiresIn),
    expiresIn: config.authAccessTokenExpiresIn,
    refreshToken: generateToken(payload, config.authRefreshTokenExpiresIn),
    refreshExpiresIn: config.authRefreshTokenExpiresIn,
  };
};
