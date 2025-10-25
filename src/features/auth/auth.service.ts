import jwt from 'jsonwebtoken';

import { config } from '../../shared/config.js';

export interface JwtPayload {
  authRequestClientKey: string;
}

const generateToken = (payload: JwtPayload, expiresIn: number) => {
  console.log(payload);
  console.log(expiresIn);
  return jwt.sign(payload, config.jwtKey, { expiresIn });
};

export const generateAccessToken = (payload: JwtPayload) =>
  generateToken(payload, accessAgeS);

export const generateRefreshToken = (payload: JwtPayload) =>
  generateToken(payload, refreshAgeS);

// TODO: forcing this to always expire for testing
export const accessAgeS = 1;
// export const accessAgeS = 15 * 60; // 15 minutes
export const refreshAgeS = 60 * 60 * 24 * 7; // 7 days
