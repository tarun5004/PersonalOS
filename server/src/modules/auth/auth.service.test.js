import { jest } from '@jest/globals';
import { AuthError, ConflictError } from '../../errors/AppError.js';
import { AuthService } from './auth.service.js';

function createUser(overrides = {}) {
  return {
    _id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    passwordHash: 'hashed-password',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

describe('AuthService', () => {
  test('registerUser creates a user with a hashed password and safe response', async () => {
    const createdUser = createUser();
    const UserModel = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(createdUser),
    };
    const bcryptAdapter = {
      hash: jest.fn().mockResolvedValue('hashed-password'),
    };
    const jwtAdapter = {
      sign: jest.fn().mockReturnValue('signed-token'),
    };
    const service = new AuthService({ UserModel, bcryptAdapter, jwtAdapter });

    const result = await service.registerUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'secret',
    });

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(bcryptAdapter.hash).toHaveBeenCalledWith('secret', 4);
    expect(UserModel.create).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
    });
    expect(result.user).toEqual({
      _id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: createdUser.createdAt,
    });
    expect(result.user.passwordHash).toBeUndefined();
    expect(result.user.role).toBeUndefined();
    expect(result.token).toBe('signed-token');
  });

  test('registerUser throws ConflictError for duplicate email', async () => {
    const service = new AuthService({
      UserModel: {
        findOne: jest.fn().mockResolvedValue(createUser()),
      },
    });

    await expect(
      service.registerUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'secret',
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  test('registerUser maps database duplicate-key errors to ConflictError', async () => {
    const duplicateError = new Error('duplicate key');
    duplicateError.code = 11000;
    const service = new AuthService({
      UserModel: {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockRejectedValue(duplicateError),
      },
      bcryptAdapter: {
        hash: jest.fn().mockResolvedValue('hashed-password'),
      },
    });

    await expect(
      service.registerUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'secret',
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  test('loginUser returns safe user and token for valid credentials', async () => {
    const user = createUser();
    const select = jest.fn().mockResolvedValue(user);
    const service = new AuthService({
      UserModel: {
        findOne: jest.fn().mockReturnValue({ select }),
      },
      bcryptAdapter: {
        compare: jest.fn().mockResolvedValue(true),
      },
      jwtAdapter: {
        sign: jest.fn().mockReturnValue('signed-token'),
      },
    });

    const result = await service.loginUser({
      email: 'test@example.com',
      password: 'secret',
    });

    expect(select).toHaveBeenCalledWith('+passwordHash');
    expect(result.user.passwordHash).toBeUndefined();
    expect(result.token).toBe('signed-token');
  });

  test('loginUser throws AuthError for invalid credentials', async () => {
    const select = jest.fn().mockResolvedValue(createUser());
    const service = new AuthService({
      UserModel: {
        findOne: jest.fn().mockReturnValue({ select }),
      },
      bcryptAdapter: {
        compare: jest.fn().mockResolvedValue(false),
      },
    });

    await expect(
      service.loginUser({
        email: 'test@example.com',
        password: 'wrong',
      }),
    ).rejects.toBeInstanceOf(AuthError);
  });

  test('getUserFromToken returns safe user for valid token', async () => {
    const user = createUser();
    const service = new AuthService({
      UserModel: {
        findById: jest.fn().mockResolvedValue(user),
      },
      jwtAdapter: {
        verify: jest.fn().mockReturnValue({ sub: 'user-1' }),
      },
    });

    const safeUser = await service.getUserFromToken('valid-token');

    expect(safeUser).toEqual({
      _id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: user.createdAt,
    });
  });

  test('getUserFromToken rejects tokens without subject', async () => {
    const service = new AuthService({
      UserModel: {
        findById: jest.fn(),
      },
      jwtAdapter: {
        verify: jest.fn().mockReturnValue({}),
      },
    });

    await expect(service.getUserFromToken('invalid-token')).rejects.toBeInstanceOf(AuthError);
  });
});
