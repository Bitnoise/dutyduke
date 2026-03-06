import { z } from 'zod';
import { dateSchema } from '@/shared/schemas/date.schema';

export const assignBenefitsSchema = z.object({
  benefitIds: z.array(z.string()),
  employeeIds: z.array(z.string()),
  startDate: dateSchema,
});

export type AssignBenefitsSchema = z.infer<typeof assignBenefitsSchema>;
