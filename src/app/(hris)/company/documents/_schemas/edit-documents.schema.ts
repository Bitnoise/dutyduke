import { z } from 'zod';
import { optionalDateSchema, nullableSchema } from '@/shared';

export const editDocumentSchema = z.object({
  category: nullableSchema,
  description: nullableSchema,
  expirationDate: optionalDateSchema,
  documents: z.array(z.string()).or(z.literal('all')),
  filter: nullableSchema,
  filterStatus: nullableSchema,
  filterCategory: nullableSchema,
});

export type EditDocumentSchema = z.input<typeof editDocumentSchema>;
