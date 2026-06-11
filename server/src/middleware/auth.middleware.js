import { env } from '../config/env.js';
import { AuthError } from '../errors/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authService } from '../modules/auth/auth.service.js';

export function createRequireAuth(service = authService) {
  return asyncHandler(async (request, response, next) => {
    const token = request.cookies?.[env.COOKIE_NAME];

    if (!token) {
      throw new AuthError('Authentication required');
    }

    request.user = await service.getUserFromToken(token);
    next();
  });
}

export const requireAuth = createRequireAuth();

