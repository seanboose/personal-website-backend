import jwt from 'jsonwebtoken';

import { config } from '../../shared/config.js';

export const maxAgeS = 15 * 60; // 15 minutes

export const generateToken = (payload: object) => {
  return jwt.sign(payload, config.jwtKey, { expiresIn: maxAgeS });
};
