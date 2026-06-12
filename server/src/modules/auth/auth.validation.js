import { z } from 'zod';

const usernameSchema = z
  .string()
  .trim()
  .min(2, 'Username must be at least 2 characters')
  .max(30, 'Username must be 30 characters or fewer')
  .regex(/^[a-zA-Z0-9_ ]+$/, 'Only letters, numbers, spaces, and underscore');

export const registerSchema = z.object({
  body: z
    .object({
      name: usernameSchema.optional(),
      username: usernameSchema.optional(),
      email: z.string().trim().toLowerCase().email('Valid email is required'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(72, 'Password too long')
        .regex(/[A-Z]/, 'Password must contain uppercase')
        .regex(/[0-9]/, 'Password must contain a number'),
      avatarId: z.string().trim().min(1).optional().default('avatar_01'),
    })
    .strict()
    .refine((value) => value.name || value.username, {
      path: ['name'],
      message: 'Name is required',
    })
    .transform((value) => ({
      name: value.name || value.username,
      email: value.email,
      password: value.password,
      avatarId: value.avatarId,
    })),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: z
    .object({
      email: z.string().trim().toLowerCase().email('Valid email is required'),
      password: z.string().min(1, 'Password is required'),
    })
    .strict(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
