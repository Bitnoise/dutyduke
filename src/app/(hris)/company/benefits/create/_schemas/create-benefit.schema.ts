import { z } from 'zod';
import { requiredSchema } from '@/shared';

export const createBenefitSchema = z.object({
  name: requiredSchema,
  note: z.string().optional(),
});

export type CreateBenefitSchema = z.input<typeof createBenefitSchema>;
