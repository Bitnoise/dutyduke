import { z } from 'zod';
import { nullableSchema } from '@/shared';
import { EQUIPMENT_STATUS } from '../_constants';

export const updateEquipmentStatusSchema = z.object({
  equipmentIds: z.array(z.string()).or(z.literal('all')),
  status: z.enum(EQUIPMENT_STATUS),
  description: nullableSchema,
  filter: nullableSchema,
  filterStatus: nullableSchema,
  filterCategory: nullableSchema,
});

export type UpdateEquipmentStatusSchema = z.infer<typeof updateEquipmentStatusSchema>;
