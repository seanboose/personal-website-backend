import { Router } from 'express';

import { requireAuth } from '../../shared/middleware/auth.js';
import { listImages } from './images.controllers.js';

export const imagesRoutes = Router();
imagesRoutes.use(requireAuth);
imagesRoutes.get('/list', listImages);
