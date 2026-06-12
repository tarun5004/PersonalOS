import { z } from 'zod';

export const ASSET_TYPES = ['dashboardBackground'];

export const generateImageAssetSchema = z.object({
  body: z
    .object({
      assetType: z.enum(ASSET_TYPES).default('dashboardBackground'),
      prompt: z
        .string()
        .trim()
        .min(12, 'Prompt must be at least 12 characters')
        .max(800, 'Prompt must be 800 characters or fewer'),
    })
    .strict(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
