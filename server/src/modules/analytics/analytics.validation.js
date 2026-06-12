import { z } from 'zod';

const emptyObjectSchema = z.object({}).strict();

export const weeklyAnalyticsSchema = z.object({
  body: emptyObjectSchema.optional(),
  params: emptyObjectSchema.optional(),
  query: emptyObjectSchema.optional(),
});
