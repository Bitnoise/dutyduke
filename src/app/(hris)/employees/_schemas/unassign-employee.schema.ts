import { z } from 'zod';
import { nullableSchema, requiredSchema } from '@/shared';

export const unassignEmployeeSchema = z.object({
  assigneeId: requiredSchema,
  equipmentIds: z.array(z.string()).or(z.literal('all')),
  filter: nullableSchema,
  filterStatus: nullableSchema,
  filterCategory: nullableSchema,
});

export type UnassignEmployeeSchema = z.infer<typeof unassignEmployeeSchema>;
