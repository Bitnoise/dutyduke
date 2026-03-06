import { z } from 'zod';
import { dateSchema, optionalSchema } from '@/shared';

export const editEmployeeDocumentSchema = z.object({
  description: z.string().min(1),
  expDate: z.union([dateSchema, optionalSchema]).transform((arg) => {
    return arg ? new Date(arg) : null;
  }),
});

export type EditEmployeeDocumentForm = z.input<typeof editEmployeeDocumentSchema>;
export type EditEmployeeDocumentSchema = z.output<typeof editEmployeeDocumentSchema>;
