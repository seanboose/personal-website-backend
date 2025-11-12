import {
  AccessTokenExpiredError,
  AccessTokenInvalidError,
  ApiError,
  AuthenticatedRequestHeadersSchema,
  UnexpectedError,
  ValidationError,
} from '@seanboose/personal-website-api-types';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { config } from '../config.js';

export const requireAuth: RequestHandler = (req, res, next) => {
  const validatedHeaders = AuthenticatedRequestHeadersSchema.parse(req.headers);
  const accessToken = validatedHeaders.authorization;
  jwt.verify(accessToken, config.jwtKey, (err: unknown) => {
    if (err instanceof Error && err.name === 'TokenExpiredError') {
      throw new AccessTokenExpiredError();
    } else if (err) {
      throw new AccessTokenInvalidError();
    }
  });

  next();
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleApiErrors: ErrorRequestHandler = (err, req, res, _next) => {
  console.error('An error occurred while handling a request:');
  console.error(err);
  if (err instanceof ApiError) {
    const { statusCode } = err;
    return res.status(statusCode).json(err);
  } else if (err instanceof z.ZodError) {
    const apiError = new ValidationError(JSON.stringify(err.issues));
    return res.status(apiError.statusCode).json(apiError);
  }
  return res.status(500).json(new UnexpectedError());
};
