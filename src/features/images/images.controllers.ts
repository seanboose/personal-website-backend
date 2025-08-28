import type { RequestHandler } from 'express';

import { getImageList } from './images.service.js';

export const listImages: RequestHandler = async (req, res, next) => {
  try {
    const result = await getImageList();
    res.status(200).json({ images: result });
  } catch (error) {
    next(error);
  }
};
