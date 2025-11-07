import jwt from 'jsonwebtoken';

import { config } from '../../shared/config.js';

export interface JwtRequestPayload {
  authRequestClientKey: string;
}

const generateToken = (payload: JwtRequestPayload, expiresIn: number) => {
  return jwt.sign(payload, config.jwtKey, { expiresIn });
};

export const generateAccessToken = (payload: JwtRequestPayload) =>
  generateToken(payload, accessAgeS);

export const generateRefreshToken = (payload: JwtRequestPayload) =>
  generateToken(payload, refreshAgeS);

// TODO making this super short for testing
export const accessAgeS = 10;
// export const accessAgeS = 15 * 60; // 15 minutes

export const refreshAgeS = 60 * 60 * 24 * 7; // 7 days
