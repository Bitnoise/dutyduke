import { z } from 'zod';
import { requiredSchema } from '@/shared';

export const deleteEmployeeDocumentSchema = z.object({
  selectedDocuments: requiredSchema,
});

export type DeleteEmployeeDocumentSchema = z.infer<typeof deleteEmployeeDocumentSchema>;
