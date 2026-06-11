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

function createRefreshTokenModel() {
  return {
    create: jest.fn().mockResolvedValue({ _id: 'refresh-token-1' }),
    findOne: jest.fn(),
    updateMany: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
    updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
  };
}

function createCryptoAdapter(token = 'refresh-token') {
  return {
    randomUUID: jest.fn().mockReturnValue('family-1'),
    randomBytes: jest.fn().mockReturnValue({
      toString: jest.fn().mockReturnValue(token),
    }),
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
      sign: jest.fn().mockReturnValue('access-token'),
    };
    const RefreshTokenModel = createRefreshTokenModel();
    const cryptoAdapter = createCryptoAdapter();
    const service = new AuthService({
      UserModel,
      RefreshTokenModel,
      bcryptAdapter,
      jwtAdapter,
      cryptoAdapter,
    });

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
    expect(jwtAdapter.sign).toHaveBeenCalledWith(
      { sub: 'user-1' },
      'test-access-secret-that-is-long-enough',
      { expiresIn: '15m' },
    );
    expect(RefreshTokenModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        familyId: 'family-1',
        userAgent: '',
      }),
    );
    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
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
      RefreshTokenModel: createRefreshTokenModel(),
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
        sign: jest.fn().mockReturnValue('access-token'),
      },
      RefreshTokenModel: createRefreshTokenModel(),
      cryptoAdapter: createCryptoAdapter(),
    });

    const result = await service.loginUser({
      email: 'test@example.com',
      password: 'secret',
    });

    expect(select).toHaveBeenCalledWith('+passwordHash');
    expect(result.user.passwordHash).toBeUndefined();
    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
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

  test('getUserFromAccessToken returns safe user for valid token', async () => {
    const user = createUser();
    const service = new AuthService({
      UserModel: {
        findById: jest.fn().mockResolvedValue(user),
      },
      jwtAdapter: {
        verify: jest.fn().mockReturnValue({ sub: 'user-1' }),
      },
    });

    const safeUser = await service.getUserFromAccessToken('valid-token');

    expect(safeUser).toEqual({
      _id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: user.createdAt,
    });
  });

  test('getUserFromAccessToken rejects tokens without subject', async () => {
    const service = new AuthService({
      UserModel: {
        findById: jest.fn(),
      },
      jwtAdapter: {
        verify: jest.fn().mockReturnValue({}),
      },
    });

    await expect(service.getUserFromAccessToken('invalid-token')).rejects.toBeInstanceOf(AuthError);
  });

  test('refreshSession rotates refresh token and returns a new access token', async () => {
    const user = createUser();
    const storedToken = {
      _id: 'old-refresh-id',
      userId: 'user-1',
      familyId: 'family-1',
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: null,
      replacedByTokenId: null,
      save: jest.fn().mockResolvedValue(undefined),
    };
    const RefreshTokenModel = {
      create: jest.fn().mockResolvedValue({ _id: 'new-refresh-id' }),
      findOne: jest.fn().mockResolvedValue(storedToken),
      updateMany: jest.fn(),
    };
    const service = new AuthService({
      UserModel: {
        findById: jest.fn().mockResolvedValue(user),
      },
      RefreshTokenModel,
      jwtAdapter: {
        verify: jest.fn(),
        sign: jest.fn().mockReturnValue('new-access-token'),
      },
      cryptoAdapter: createCryptoAdapter('new-refresh-token'),
    });

    const result = await service.refreshSession('old-refresh-token');

    expect(result.user.email).toBe('test@example.com');
    expect(result.accessToken).toBe('new-access-token');
    expect(result.refreshToken).toBe('new-refresh-token');
    expect(storedToken.revokedAt).toBeInstanceOf(Date);
    expect(storedToken.replacedByTokenId).toBe('new-refresh-id');
    expect(storedToken.save).toHaveBeenCalled();
  });

  test('refreshSession revokes a reused token family', async () => {
    const RefreshTokenModel = {
      create: jest.fn(),
      findOne: jest.fn().mockResolvedValue({
        userId: 'user-1',
        familyId: 'family-1',
        expiresAt: new Date(Date.now() + 60_000),
        revokedAt: new Date(),
        replacedByTokenId: 'new-refresh-id',
      }),
      updateMany: jest.fn().mockResolvedValue({ modifiedCount: 2 }),
    };
    const service = new AuthService({ RefreshTokenModel });

    await expect(service.refreshSession('reused-token')).rejects.toBeInstanceOf(AuthError);
    expect(RefreshTokenModel.updateMany).toHaveBeenCalledWith(
      { userId: 'user-1', familyId: 'family-1', revokedAt: null },
      { $set: { revokedAt: expect.any(Date) } },
    );
  });

  test('logout revokes an existing refresh token', async () => {
    const storedToken = {
      revokedAt: null,
      save: jest.fn().mockResolvedValue(undefined),
    };
    const RefreshTokenModel = {
      findOne: jest.fn().mockResolvedValue(storedToken),
    };
    const service = new AuthService({ RefreshTokenModel });

    await service.logout('refresh-token');

    expect(storedToken.revokedAt).toBeInstanceOf(Date);
    expect(storedToken.save).toHaveBeenCalled();
  });
});
