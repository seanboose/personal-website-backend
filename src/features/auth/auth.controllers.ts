import {
  type AuthGrantRequestBody,
  AuthGrantRequestBodySchema,
  authGrantRequestHeaderName,
  AuthGrantRequestHeadersSchema,
  type AuthGrantResponse,
  AuthKeyInvalidError,
  type AuthRefreshRequestBody,
  AuthRefreshRequestBodySchema,
  type AuthRefreshResponse,
  RefreshTokenExpiredError,
  RefreshTokenInvalidError,
} from '@seanboose/personal-website-api-types';
import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../../shared/config.js';
import { createAuthTokens } from './auth.service.js';

export const grantAuth: RequestHandler<
  never,
  AuthGrantResponse,
  AuthGrantRequestBody,
  never
> = (req, res) => {
  const validatedHeaders = AuthGrantRequestHeadersSchema.parse(req.headers);
  const validatedBody = AuthGrantRequestBodySchema.parse(req.body);

  const authRequestKey = validatedHeaders[authGrantRequestHeaderName];
  if (authRequestKey !== config.authRequestKey) {
    throw new AuthKeyInvalidError();
  }

  const client = validatedBody.authRequestClient;
  res.status(200).json(createAuthTokens(client) satisfies AuthGrantResponse);
};

export const refreshAuth: RequestHandler<
  never,
  AuthRefreshResponse,
  AuthRefreshRequestBody,
  never
> = (req, res) => {
  const validatedBody = AuthRefreshRequestBodySchema.parse(req.body);
  const refreshToken = validatedBody.refreshToken;
  let decodedToken;
  try {
    decodedToken = jwt.verify(refreshToken, config.jwtKey);
  } catch (err) {
    if (err instanceof Error && err.name === 'TokenExpiredError') {
      throw new RefreshTokenExpiredError();
    } else if (err) {
      throw new RefreshTokenInvalidError();
    }
  }

  let client: string | undefined = undefined;
  if (typeof decodedToken !== 'undefined' && typeof decodedToken !== 'string') {
    client = decodedToken.authRequestClientKey;
  }
  if (typeof client === 'undefined') {
    throw new RefreshTokenInvalidError();
  }

  res.status(200).json(createAuthTokens(client) satisfies AuthRefreshResponse);
};
