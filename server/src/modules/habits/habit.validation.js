import { z } from 'zod';
import {
  HABIT_COLOR_OPTIONS,
  HABIT_DESCRIPTION_MAX_LENGTH,
  HABIT_NAME_MAX_LENGTH,
} from './habit.model.js';

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Valid habit id is required');

const monthSchema = z
  .string()
  .regex(/^(20\d{2}|21\d{2})-(0[1-9]|1[0-2])$/, 'Month must use YYYY-MM format')
  .optional();

const habitBodySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Habit name is required')
      .max(HABIT_NAME_MAX_LENGTH, `Habit name must be ${HABIT_NAME_MAX_LENGTH} characters or fewer`),
    description: z
      .string()
      .trim()
      .max(
        HABIT_DESCRIPTION_MAX_LENGTH,
        `Description must be ${HABIT_DESCRIPTION_MAX_LENGTH} characters or fewer`,
      )
      .optional(),
    color: z.enum(HABIT_COLOR_OPTIONS).optional(),
    icon: z.string().trim().max(30).optional().default('default'),
    frequency: z.literal('daily').optional().default('daily'),
  })
  .strict();

const habitUpdateBodySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Habit name cannot be empty')
      .max(HABIT_NAME_MAX_LENGTH, `Habit name must be ${HABIT_NAME_MAX_LENGTH} characters or fewer`)
      .optional(),
    description: z
      .string()
      .trim()
      .max(
        HABIT_DESCRIPTION_MAX_LENGTH,
        `Description must be ${HABIT_DESCRIPTION_MAX_LENGTH} characters or fewer`,
      )
      .optional(),
    color: z.enum(HABIT_COLOR_OPTIONS).optional(),
    icon: z.string().trim().max(30).optional(),
    frequency: z.literal('daily').optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one habit field is required',
  });

const monthQuerySchema = z
  .object({
    month: monthSchema,
    limit: z.coerce.number().int().min(1).max(100).default(50),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .strict();

const optionalMonthQuerySchema = z
  .object({
    month: monthSchema,
  })
  .strict();

const emptyObjectSchema = z.object({}).strict();
const checkInBodySchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
    note: z.string().trim().max(200).optional(),
  })
  .strict()
  .optional()
  .default({});

export const listHabitsSchema = z.object({
  body: emptyObjectSchema.optional(),
  params: emptyObjectSchema.optional(),
  query: monthQuerySchema,
});

export const createHabitSchema = z.object({
  body: habitBodySchema,
  params: emptyObjectSchema.optional(),
  query: emptyObjectSchema.optional(),
});

export const habitIdSchema = z.object({
  body: emptyObjectSchema.optional(),
  params: z.object({
    id: objectIdSchema,
  }),
  query: optionalMonthQuerySchema.optional(),
});

export const updateHabitSchema = z.object({
  body: habitUpdateBodySchema,
  params: z.object({
    id: objectIdSchema,
  }),
  query: optionalMonthQuerySchema.optional(),
});

export const checkInHabitSchema = z.object({
  body: checkInBodySchema,
  params: z.object({
    id: objectIdSchema,
  }),
  query: emptyObjectSchema.optional(),
});
