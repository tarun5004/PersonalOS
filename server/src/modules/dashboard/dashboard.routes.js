import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { dashboardController } from './dashboard.controller.js';

export function createDashboardRoutes({
  controller = dashboardController,
  requireAuthMiddleware = requireAuth,
} = {}) {
  const router = Router();

  router.use(requireAuthMiddleware);
  router.get('/summary', asyncHandler(controller.summary));

  return router;
}

export const dashboardRoutes = createDashboardRoutes();
