import { z } from 'zod';
import { nullableSchema } from '@/shared';

export const deleteDocumentSchema = z.object({
  documents: z.array(z.string()).or(z.literal('all')),
  filter: nullableSchema,
  filterStatus: nullableSchema,
  filterCategory: nullableSchema,
});

export type DeleteDocumentSchema = z.input<typeof deleteDocumentSchema>;
