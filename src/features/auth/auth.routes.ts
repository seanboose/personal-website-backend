import { Router } from 'express';

import { grantAuth } from './auth.controllers.js';

export const authRoutes = Router();
authRoutes.post('/grant', grantAuth);
