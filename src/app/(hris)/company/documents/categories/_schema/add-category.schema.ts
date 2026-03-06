import { z } from 'zod';
import { requiredSchema } from '@/shared';

export const addCategorySchema = z.object({
  name: requiredSchema,
});

export type AddCategorySchema = z.infer<typeof addCategorySchema>;
