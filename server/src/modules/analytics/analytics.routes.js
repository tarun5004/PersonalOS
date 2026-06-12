import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { analyticsController } from './analytics.controller.js';
import { weeklyAnalyticsSchema } from './analytics.validation.js';

export function createAnalyticsRoutes({
  controller = analyticsController,
  requireAuthMiddleware = requireAuth,
} = {}) {
  const router = Router();

  router.use(requireAuthMiddleware);
  router.get('/weekly', validate(weeklyAnalyticsSchema), asyncHandler(controller.weekly));

  return router;
}

export const analyticsRoutes = createAnalyticsRoutes();
