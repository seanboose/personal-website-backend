import { Router } from 'express';
import { listImages } from './images.controllers';

export const imagesRoutes = Router();

imagesRoutes.get('list', listImages);
