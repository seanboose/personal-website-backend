import { Router } from 'express';

import { grantAuth, refreshAuth } from './auth.controllers.js';

export const authRoutes = Router();
authRoutes.post('/grant', grantAuth);
authRoutes.post('/refresh', refreshAuth);
