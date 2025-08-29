import { Router } from 'express';

import { listImages } from './images.controllers.js';

export const imagesRoutes = Router();

imagesRoutes.get('list', listImages);
