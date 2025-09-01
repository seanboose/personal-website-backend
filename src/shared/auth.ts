import type { RequestHandler } from 'express';

import { config } from './config.js';

export const requireAuth: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token && token === config.apiKey) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
