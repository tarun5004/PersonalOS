import { z } from 'zod';

export const assetImageFormSchema = z.object({
  assetType: z.enum(['dashboardBackground']).default('dashboardBackground'),
  prompt: z
    .string()
    .trim()
    .min(12, 'Prompt must be at least 12 characters')
    .max(800, 'Prompt must be 800 characters or fewer'),
});

export function resolveAssetImageFormValues(values) {
  const result = assetImageFormSchema.safeParse(values);

  if (result.success) {
    return {
      errors: {},
      values: result.data,
    };
  }

  const errors = result.error.issues.reduce((fieldErrors, issue) => {
    const field = issue.path[0];

    if (!field || fieldErrors[field]) {
      return fieldErrors;
    }

    return {
      ...fieldErrors,
      [field]: {
        message: issue.message,
        type: 'validation',
      },
    };
  }, {});

  return {
    errors,
    values: {},
  };
}
