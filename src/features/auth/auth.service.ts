import jwt from 'jsonwebtoken';

import { config } from '../../shared/config.js';

export interface JwtRequestPayload {
  authRequestClientKey: string;
}

export const createAuthTokens = (client: string) => {
  const payload: JwtRequestPayload = { authRequestClientKey: client };
  const accessTokenExpiresIn = config.authAccessTokenExpiresIn;
  const refreshTokenExpiresIn = config.authRefreshTokenExpiresIn;
  return {
    accessToken: generateToken(payload, accessTokenExpiresIn),
    expiresIn: accessTokenExpiresIn,
    refreshToken: generateToken(payload, refreshTokenExpiresIn),
    refreshExpiresIn: refreshTokenExpiresIn,
  };
};

const generateToken = (payload: JwtRequestPayload, expiresIn: number) => {
  return jwt.sign(payload, config.jwtKey, { expiresIn });
};
