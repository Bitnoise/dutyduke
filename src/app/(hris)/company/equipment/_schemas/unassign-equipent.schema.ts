import { z } from 'zod';
import { nullableSchema } from '@/shared';

export const unassignEquipmentSchema = z.object({
  equipmentIds: z.array(z.string()).or(z.literal('all')),
  filter: nullableSchema,
  filterStatus: nullableSchema,
  filterCategory: nullableSchema,
});

export type UnassignEquipmentSchema = z.infer<typeof unassignEquipmentSchema>;
