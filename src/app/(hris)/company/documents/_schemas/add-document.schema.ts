import { z } from 'zod';
import { optionalDateSchema, ERROR_MESSAGES, MAX_FILE_SIZE, nullableSchema } from '@/shared';

export const addDocumentSchema = z.object({
  category: nullableSchema,
  description: nullableSchema,
  expirationDate: optionalDateSchema,
  documents: z
    .array(z.instanceof(File))
    .min(1, ERROR_MESSAGES.REQUIRED)
    .refine(
      (files) => files.every((file) => file.size < MAX_FILE_SIZE),
      ERROR_MESSAGES.INVALID_DOCUMENT_SIZE,
    ),
});

export type AddDocumentSchema = z.input<typeof addDocumentSchema>;
