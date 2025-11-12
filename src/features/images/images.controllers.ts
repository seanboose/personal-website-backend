import { type ImagesListResponse } from '@seanboose/personal-website-api-types';
import type { RequestHandler } from 'express';

import { getImageList } from './images.service.js';

export const listImages: RequestHandler<
  never,
  ImagesListResponse,
  never,
  never
> = async (req, res, next) => {
  try {
    const result = await getImageList();
    return res.status(200).json({ images: result });
  } catch (error) {
    next(error);
  }
};
