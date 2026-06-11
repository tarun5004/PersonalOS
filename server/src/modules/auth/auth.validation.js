import { z } from 'zod';

export const registerSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1, 'Name is required'),
      email: z.string().trim().toLowerCase().email('Valid email is required'),
      password: z.string().min(1, 'Password is required'),
    })
    .strict(),
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

