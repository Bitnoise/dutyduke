import { z } from 'zod';
import { requiredSchema } from '@/shared';

export const languageSchema = z.object({
  id: requiredSchema,
  name: requiredSchema,
  level: requiredSchema,
});

export type LanguageSchema = z.infer<typeof languageSchema>;
