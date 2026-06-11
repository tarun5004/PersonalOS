import { clearAuthCookie, setAuthCookie } from '../../config/cookie.js';
import { authService } from './auth.service.js';

export class AuthController {
  constructor(service = authService) {
    this.service = service;
  }

  register = async (request, response) => {
    const result = await this.service.registerUser(request.validated.body);
    setAuthCookie(response, result.token);

    response.status(201).json({
      success: true,
      data: {
        user: result.user,
      },
    });
  };

  login = async (request, response) => {
    const result = await this.service.loginUser(request.validated.body);
    setAuthCookie(response, result.token);

    response.status(200).json({
      success: true,
      data: {
        user: result.user,
      },
    });
  };

  logout = async (request, response) => {
    clearAuthCookie(response);

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
}

export const authController = new AuthController();

