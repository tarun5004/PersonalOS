import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ quiet: true });

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const booleanFromString = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive(),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.literal('7d'),
  CLIENT_URL: z.string().url(),
  CORS_ORIGIN: z.string().url(),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive(),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive(),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive(),
  COOKIE_NAME: z.string().min(1),
  COOKIE_MAX_AGE_MS: z.coerce.number().int().positive(),
  COOKIE_SECURE: booleanFromString,
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid server environment configuration.');
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

if (parsedEnv.data.COOKIE_MAX_AGE_MS !== SEVEN_DAYS_MS) {
  console.error('COOKIE_MAX_AGE_MS must match JWT_EXPIRES_IN=7d.');
  process.exit(1);
}

if (parsedEnv.data.NODE_ENV === 'production' && !parsedEnv.data.COOKIE_SECURE) {
  console.error('COOKIE_SECURE must be true when NODE_ENV is production.');
  process.exit(1);
}

if (parsedEnv.data.COOKIE_SAME_SITE === 'none' && !parsedEnv.data.COOKIE_SECURE) {
  console.error('COOKIE_SECURE must be true when COOKIE_SAME_SITE is none.');
  process.exit(1);
}

export const env = parsedEnv.data;
