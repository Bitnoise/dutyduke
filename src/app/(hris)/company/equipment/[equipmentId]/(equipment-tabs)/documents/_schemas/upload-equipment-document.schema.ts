import { z } from 'zod';
import { ERROR_MESSAGES, MAX_FILE_SIZE, requiredSchema } from '@/shared';

export const uploadEquipmentDocumentSchema = z.object({
  equipmentId: requiredSchema,
  file: z
    .any()
    .refine((file: File) => file?.name.length !== 0, ERROR_MESSAGES.REQUIRED)
    .refine((file) => file.size < MAX_FILE_SIZE, ERROR_MESSAGES.INVALID_DOCUMENT_SIZE),
});

export type UploadEquipmentDocumentSchema = z.input<typeof uploadEquipmentDocumentSchema>;
