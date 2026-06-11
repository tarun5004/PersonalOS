import { z } from 'zod';
import { TASK_PRIORITIES, TASK_STATUSES } from './task.model.js';

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Valid task id is required');

const dueDateSchema = z
  .string()
  .trim()
  .min(1, 'Valid due date is required')
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'Valid due date is required',
  })
  .transform((value) => new Date(value));

const taskBodySchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim().optional(),
    priority: z.enum(TASK_PRIORITIES).optional().default('Medium'),
    dueDate: dueDateSchema,
    status: z.enum(TASK_STATUSES).optional().default('Todo'),
  })
  .strict();

const taskUpdateBodySchema = z
  .object({
    title: z.string().trim().min(1, 'Title cannot be empty').optional(),
    description: z.string().trim().optional(),
    priority: z.enum(TASK_PRIORITIES).optional(),
    dueDate: dueDateSchema.optional(),
    status: z.enum(TASK_STATUSES).optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one task field is required',
  });

export const taskIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: objectIdSchema,
  }),
  query: z.object({}).optional(),
});

export const createTaskSchema = z.object({
  body: taskBodySchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateTaskSchema = z.object({
  body: taskUpdateBodySchema,
  params: z.object({
    id: objectIdSchema,
  }),
  query: z.object({}).optional(),
});

export const listTasksSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z
    .object({
      limit: z.coerce.number().int().min(1).max(100).default(50),
      offset: z.coerce.number().int().min(0).default(0),
    })
    .strict(),
});
