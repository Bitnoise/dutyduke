import { z } from 'zod';
import { nullableSchema } from '@/shared';

export const archiveEquipmentSchema = z.object({
  equipmentIds: z.array(z.string()).or(z.literal('all')),
  description: nullableSchema,
  filter: nullableSchema,
  filterStatus: nullableSchema,
  filterCategory: nullableSchema,
});

export type ArchiveEquipmentSchema = z.infer<typeof archiveEquipmentSchema>;
