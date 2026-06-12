import { z } from 'zod';
import { TASK_PRIORITIES, TASK_STATUSES } from './task.model.js';

const STATUS_ALIASES = {
  todo: 'Todo',
  'in_progress': 'In Progress',
  'in progress': 'In Progress',
  completed: 'Completed',
};

const PRIORITY_ALIASES = {
  low: 'Low',
  normal: 'Medium',
  medium: 'Medium',
  high: 'High',
  urgent: 'High',
};

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

const optionalDueDateSchema = dueDateSchema.nullish().transform((value) => value || null);

const statusSchema = z
  .string()
  .trim()
  .transform((value, context) => {
    const normalized = STATUS_ALIASES[value.toLowerCase()] || value;

    if (!TASK_STATUSES.includes(normalized)) {
      context.addIssue({
        code: 'custom',
        message: 'Valid task status is required',
      });
      return z.NEVER;
    }

    return normalized;
  });

const prioritySchema = z
  .string()
  .trim()
  .transform((value, context) => {
    const normalized = PRIORITY_ALIASES[value.toLowerCase()] || value;

    if (!TASK_PRIORITIES.includes(normalized)) {
      context.addIssue({
        code: 'custom',
        message: 'Valid task priority is required',
      });
      return z.NEVER;
    }

    return normalized;
  });

const tagSchema = z.array(z.string().trim().max(30)).max(10).optional().default([]);

const taskBodySchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
    description: z.string().trim().max(2000, 'Description is too long').optional(),
    priority: prioritySchema.optional().default('Medium'),
    dueDate: optionalDueDateSchema,
    status: statusSchema.optional().default('Todo'),
    estimatedMinutes: z.coerce.number().int().min(1).max(480).nullish().transform((value) => value || null),
    tags: tagSchema,
  })
  .strict();

const taskUpdateBodySchema = z
  .object({
    title: z.string().trim().min(1, 'Title cannot be empty').max(200, 'Title is too long').optional(),
    description: z.string().trim().max(2000, 'Description is too long').optional(),
    priority: prioritySchema.optional(),
    dueDate: optionalDueDateSchema.optional(),
    status: statusSchema.optional(),
    estimatedMinutes: z.coerce.number().int().min(1).max(480).nullish().optional(),
    tags: tagSchema.optional(),
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
      status: statusSchema.or(z.literal('all')).optional(),
      priority: prioritySchema.optional(),
      search: z.string().trim().max(100).optional(),
    })
    .strict(),
});
