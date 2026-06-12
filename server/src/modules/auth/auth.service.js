import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { uploadCloudinaryImage } from '../../config/cloudinary.js';
import logger from '../../config/logger.js';
import { AuthError, ConflictError } from '../../errors/AppError.js';
import { User } from './auth.model.js';
import { RefreshToken } from './refreshToken.model.js';

function toSafeUser(user) {
  const source = typeof user.toObject === 'function' ? user.toObject() : user;

  return {
    _id: source._id.toString(),
    name: source.name,
    email: source.email,
    avatarId: source.avatarId || 'avatar_01',
    avatarUrl: source.avatarUrl || '',
    avatarPublicId: source.avatarPublicId || '',
    dashboardBackgroundUrl: source.dashboardBackgroundUrl || '',
    xp: source.xp || 0,
    achievementIds: source.achievementIds || [],
    createdAt: source.createdAt,
  };
}

function hashRefreshToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function createOpaqueToken() {
  return crypto.randomBytes(48).toString('base64url');
}

function getRefreshTokenExpiry() {
  return new Date(Date.now() + env.REFRESH_TOKEN_MAX_AGE_MS);
}

function getUserId(value) {
  return value?.toString?.() || value;
}

export class AuthService {
  constructor({
    UserModel = User,
    RefreshTokenModel = RefreshToken,
    bcryptAdapter = bcrypt,
    jwtAdapter = jwt,
    cryptoAdapter = crypto,
    imageUploader = uploadCloudinaryImage,
  } = {}) {
    this.UserModel = UserModel;
    this.RefreshTokenModel = RefreshTokenModel;
    this.bcrypt = bcryptAdapter;
    this.jwt = jwtAdapter;
    this.crypto = cryptoAdapter;
    this.imageUploader = imageUploader;
  }

  async registerUser({ name, email, password, avatarId = 'avatar_01' }, requestMeta = {}) {
    const existingUser = await this.UserModel.findOne({ email });

    if (existingUser) {
      throw new ConflictError('Email already exists');
    }

    const passwordHash = await this.bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
    let user;

    try {
      user = await this.UserModel.create({
        name,
        email,
        avatarId,
        passwordHash,
      });
    } catch (error) {
      if (error?.code === 11000) {
        throw new ConflictError('Email already exists');
      }

      throw error;
    }

    const result = await this.buildAuthResult(user, requestMeta);

    logger.info({ userId: result.user._id, email: result.user.email }, 'User registered');

    return result;
  }

  async loginUser({ email, password }, requestMeta = {}) {
    const userQuery = this.UserModel.findOne({ email });
    const user =
      typeof userQuery.select === 'function'
        ? await userQuery.select('+passwordHash')
        : await userQuery;

    if (!user) {
      logger.warn({ email }, 'Failed login attempt');
      throw new AuthError('Invalid credentials');
    }

    const passwordMatches = await this.bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      logger.warn({ userId: getUserId(user._id), email }, 'Failed login attempt');
      throw new AuthError('Invalid credentials');
    }

    const result = await this.buildAuthResult(user, requestMeta);

    logger.info({ userId: result.user._id }, 'User logged in');

    return result;
  }

  async getUserFromAccessToken(token) {
    let payload;

    try {
      payload = this.jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    } catch {
      throw new AuthError('Invalid or expired token');
    }

    if (!payload?.sub) {
      throw new AuthError('Invalid or expired token');
    }

    const user = await this.UserModel.findById(payload.sub);

    if (!user) {
      throw new AuthError('Invalid or expired token');
    }

    return toSafeUser(user);
  }

  async refreshSession(refreshToken, requestMeta = {}) {
    if (!refreshToken) {
      throw new AuthError('Authentication required');
    }

    const tokenHash = hashRefreshToken(refreshToken);
    const storedToken = await this.RefreshTokenModel.findOne({ tokenHash });

    if (!storedToken) {
      throw new AuthError('Invalid or expired refresh token');
    }

    if (storedToken.revokedAt || storedToken.replacedByTokenId) {
      await this.revokeTokenFamily(storedToken.userId, storedToken.familyId);
      throw new AuthError('Invalid or expired refresh token');
    }

    if (storedToken.expiresAt <= new Date()) {
      await this.revokeRefreshTokenDocument(storedToken);
      throw new AuthError('Invalid or expired refresh token');
    }

    const user = await this.UserModel.findById(storedToken.userId);

    if (!user) {
      await this.revokeRefreshTokenDocument(storedToken);
      throw new AuthError('Invalid or expired refresh token');
    }

    const nextRefreshToken = await this.createRefreshToken(
      storedToken.userId,
      storedToken.familyId,
      requestMeta,
    );

    await this.replaceRefreshTokenDocument(storedToken, nextRefreshToken.documentId);

    return {
      user: toSafeUser(user),
      accessToken: this.createAccessToken(getUserId(storedToken.userId)),
      refreshToken: nextRefreshToken.token,
    };
  }

  async logout(refreshToken) {
    if (!refreshToken) {
      return;
    }

    const tokenHash = hashRefreshToken(refreshToken);
    const storedToken = await this.RefreshTokenModel.findOne({ tokenHash });

    if (storedToken) {
      await this.revokeRefreshTokenDocument(storedToken);
      logger.info({ userId: getUserId(storedToken.userId) }, 'User logged out');
    }
  }

  async updateAvatarAsset(userId, { dataUrl }) {
    const upload = await this.imageUploader({
      dataUrl,
      folder: 'avatars',
      publicIdPrefix: `avatar-${userId}`,
      tags: ['personal-os', 'avatar'],
    });
    const user = await this.UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          avatarUrl: upload.url,
          avatarPublicId: upload.publicId,
        },
      },
      { new: true },
    );

    if (!user) {
      throw new AuthError('Authentication required');
    }

    logger.info({ userId }, 'User avatar uploaded');

    return toSafeUser(user);
  }

  async buildAuthResult(user, requestMeta = {}) {
    const safeUser = toSafeUser(user);
    const refreshToken = await this.createRefreshToken(safeUser._id, undefined, requestMeta);

    return {
      user: safeUser,
      accessToken: this.createAccessToken(safeUser._id),
      refreshToken: refreshToken.token,
    };
  }

  createAccessToken(userId) {
    return this.jwt.sign({ sub: userId }, env.ACCESS_TOKEN_SECRET, {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  async createRefreshToken(userId, familyId = this.crypto.randomUUID(), requestMeta = {}) {
    const token =
      typeof this.crypto.randomBytes === 'function'
        ? this.crypto.randomBytes(48).toString('base64url')
        : createOpaqueToken();
    const document = await this.RefreshTokenModel.create({
      userId,
      tokenHash: hashRefreshToken(token),
      familyId,
      expiresAt: getRefreshTokenExpiry(),
      userAgent: requestMeta.userAgent || '',
    });

    return {
      token,
      documentId: document._id,
    };
  }

  async replaceRefreshTokenDocument(storedToken, replacementId) {
    storedToken.revokedAt = new Date();
    storedToken.replacedByTokenId = replacementId;
    storedToken.lastUsedAt = new Date();

    if (typeof storedToken.save === 'function') {
      await storedToken.save();
      return;
    }

    await this.RefreshTokenModel.updateOne(
      { _id: storedToken._id },
      {
        $set: {
          revokedAt: storedToken.revokedAt,
          replacedByTokenId: replacementId,
          lastUsedAt: storedToken.lastUsedAt,
        },
      },
    );
  }

  async revokeRefreshTokenDocument(storedToken) {
    storedToken.revokedAt = storedToken.revokedAt || new Date();

    if (typeof storedToken.save === 'function') {
      await storedToken.save();
      return;
    }

    await this.RefreshTokenModel.updateOne(
      { _id: storedToken._id },
      { $set: { revokedAt: storedToken.revokedAt } },
    );
  }

  async revokeTokenFamily(userId, familyId) {
    await this.RefreshTokenModel.updateMany(
      { userId, familyId, revokedAt: null },
      { $set: { revokedAt: new Date() } },
    );
  }
}

export const authService = new AuthService();
