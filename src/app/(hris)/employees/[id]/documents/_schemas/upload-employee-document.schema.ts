import { z } from 'zod';
import { ERROR_MESSAGES, requiredSchema } from '@/shared';

const MAX_FILE_SIZE = 10000000;

export const uploadEmployeeDocumentSchema = z.object({
  employeeId: requiredSchema,
  file: z
    .any()
    .refine((file: File) => file?.name.length !== 0, ERROR_MESSAGES.REQUIRED)
    .refine((file) => file.size < MAX_FILE_SIZE, ERROR_MESSAGES.INVALID_DOCUMENT_SIZE),
});

export type UploadEmployeeDocumentSchema = z.input<typeof uploadEmployeeDocumentSchema>;
