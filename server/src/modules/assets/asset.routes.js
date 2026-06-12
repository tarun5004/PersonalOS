import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { aiImageLimiter } from '../../middleware/rateLimit.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { assetController } from './asset.controller.js';
import { generateImageAssetSchema } from './asset.validation.js';

export function createAssetRoutes({
  controller = assetController,
  requireAuthMiddleware = requireAuth,
} = {}) {
  const router = Router();

  router.use(requireAuthMiddleware);

  router.post('/images', aiImageLimiter, validate(generateImageAssetSchema), asyncHandler(controller.generateImage));

  return router;
}

export const assetRoutes = createAssetRoutes();
