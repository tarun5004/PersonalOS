import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { authRateLimiter } from '../../middleware/rateLimit.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authController } from './auth.controller.js';
import { avatarUploadSchema, loginSchema, registerSchema } from './auth.validation.js';

export function createAuthRoutes({
  controller = authController,
  rateLimiter = authRateLimiter,
  requireAuthMiddleware = requireAuth,
} = {}) {
  const router = Router();

  router.use(rateLimiter);

  router.post('/register', validate(registerSchema), asyncHandler(controller.register));

  router.post('/login', validate(loginSchema), asyncHandler(controller.login));

  router.post('/refresh', asyncHandler(controller.refresh));

  router.post('/logout', asyncHandler(controller.logout));

  router.get('/me', requireAuthMiddleware, asyncHandler(controller.me));

  router.patch(
    '/me/avatar',
    requireAuthMiddleware,
    validate(avatarUploadSchema),
    asyncHandler(controller.updateAvatar),
  );

  return router;
}

export const authRoutes = createAuthRoutes();
