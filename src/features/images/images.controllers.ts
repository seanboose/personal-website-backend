import { getImageList } from './images.service.js';
import type { RequestHandler } from 'express';

export const listImages: RequestHandler = async (req, res, next) => {
  try {
    const result = await getImageList();
    res.status(201).json({ images: result });
  } catch (error) {
    next(error);
  }
};
