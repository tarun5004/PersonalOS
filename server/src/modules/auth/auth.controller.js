import { env } from '../../config/env.js';
import { clearRefreshCookie, setRefreshCookie } from '../../config/cookie.js';
import { authService } from './auth.service.js';

export class AuthController {
  constructor(service = authService) {
    this.service = service;
  }

  register = async (request, response) => {
    const result = await this.service.registerUser(
      request.validated.body,
      this.getRequestMeta(request),
    );
    setRefreshCookie(response, result.refreshToken);

    response.status(201).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  };

  login = async (request, response) => {
    const result = await this.service.loginUser(
      request.validated.body,
      this.getRequestMeta(request),
    );
    setRefreshCookie(response, result.refreshToken);

    response.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  };

  refresh = async (request, response) => {
    const result = await this.service.refreshSession(
      request.cookies?.[env.REFRESH_TOKEN_COOKIE_NAME],
      this.getRequestMeta(request),
    );
    setRefreshCookie(response, result.refreshToken);

    response.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  };

  logout = async (request, response) => {
    await this.service.logout(request.cookies?.[env.REFRESH_TOKEN_COOKIE_NAME]);
    clearRefreshCookie(response);

    response.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  };

  me = async (request, response) => {
    response.status(200).json({
      success: true,
      data: {
        user: request.user,
      },
    });
  };

  getRequestMeta(request) {
    return {
      userAgent: request.get('user-agent') || '',
    };
  }
}

export const authController = new AuthController();
