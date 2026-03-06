import { z } from 'zod';
import { requiredSchema } from '@/shared';

export const deleteEarningsSchema = z.object({
  employeeId: requiredSchema,
  id: requiredSchema,
});

export type DeleteEarningsSchema = z.infer<typeof deleteEarningsSchema>;
