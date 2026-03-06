import { z } from 'zod';
import { requiredSchema } from '@/shared';

export const skillSchema = z.object({
  id: requiredSchema,
  name: requiredSchema,
  skillId: requiredSchema,
});

export type SkillSchema = z.infer<typeof skillSchema>;
