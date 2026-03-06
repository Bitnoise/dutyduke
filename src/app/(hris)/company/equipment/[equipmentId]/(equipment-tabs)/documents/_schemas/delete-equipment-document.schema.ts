import { z } from 'zod';
import { requiredSchema } from '@/shared';

export const deleteEquipmentDocumentSchema = z.object({
  selectedDocuments: requiredSchema,
});

export type DeleteEquipmentDocumentSchema = z.infer<typeof deleteEquipmentDocumentSchema>;
