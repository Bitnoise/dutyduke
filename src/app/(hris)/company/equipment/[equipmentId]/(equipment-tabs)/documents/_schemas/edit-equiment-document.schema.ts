import { z } from 'zod';
import { dateSchema, optionalSchema } from '@/shared';

export const editEquipmentDocumentSchema = z.object({
  description: z.string().min(1),
  expDate: z.union([dateSchema, optionalSchema]).transform((arg) => {
    return arg ? new Date(arg) : null;
  }),
});

export type EditEquipmentDocumentForm = z.input<typeof editEquipmentDocumentSchema>;
export type EditEquipmentDocumentSchema = z.output<typeof editEquipmentDocumentSchema>;
