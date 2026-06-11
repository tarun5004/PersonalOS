import { AuthError } from '../errors/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authService } from '../modules/auth/auth.service.js';

export function createRequireAuth(service = authService) {
  return asyncHandler(async (request, response, next) => {
    const authorizationHeader = request.get('authorization') || '';
    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AuthError('Authentication required');
    }

    request.user = await service.getUserFromAccessToken(token);
    next();
  });
}

export const requireAuth = createRequireAuth();
