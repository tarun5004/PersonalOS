import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { AuthError, ConflictError } from '../../errors/AppError.js';
import { User } from './auth.model.js';

function toSafeUser(user) {
  const source = typeof user.toObject === 'function' ? user.toObject() : user;

  return {
    _id: source._id.toString(),
    name: source.name,
    email: source.email,
    createdAt: source.createdAt,
  };
}

export class AuthService {
  constructor({ UserModel = User, bcryptAdapter = bcrypt, jwtAdapter = jwt } = {}) {
    this.UserModel = UserModel;
    this.bcrypt = bcryptAdapter;
    this.jwt = jwtAdapter;
  }

  async registerUser({ name, email, password }) {
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
        passwordHash,
      });
    } catch (error) {
      if (error?.code === 11000) {
        throw new ConflictError('Email already exists');
      }

      throw error;
    }

    return this.buildAuthResult(user);
  }

  async loginUser({ email, password }) {
    const userQuery = this.UserModel.findOne({ email });
    const user =
      typeof userQuery.select === 'function'
        ? await userQuery.select('+passwordHash')
        : await userQuery;

    if (!user) {
      throw new AuthError('Invalid credentials');
    }

    const passwordMatches = await this.bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      throw new AuthError('Invalid credentials');
    }

    return this.buildAuthResult(user);
  }

  async getUserFromToken(token) {
    let payload;

    try {
      payload = this.jwt.verify(token, env.JWT_SECRET);
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

  buildAuthResult(user) {
    const safeUser = toSafeUser(user);
    const token = this.jwt.sign({ sub: safeUser._id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    return {
      user: safeUser,
      token,
    };
  }
}

export const authService = new AuthService();
