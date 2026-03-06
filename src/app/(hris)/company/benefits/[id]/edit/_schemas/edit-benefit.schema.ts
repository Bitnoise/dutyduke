import { z } from 'zod';
import { requiredSchema } from '@/shared';

export const editBenefitSchema = z.object({
  name: requiredSchema,
  note: z.string().optional(),
});

export type EditBenefitSchema = z.input<typeof editBenefitSchema>;
