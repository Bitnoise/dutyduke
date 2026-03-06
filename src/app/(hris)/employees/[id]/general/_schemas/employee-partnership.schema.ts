import { z } from 'zod';
import { EMPLOYMENT_TYPES_KEYS, ERROR_MESSAGES, nullableSchema, optionalStringToNumSchema } from '@/shared';

export const employeePartnershipSchema = z.object({
  role: nullableSchema,
  employmentType: nullableSchema.pipe(z.enum(EMPLOYMENT_TYPES_KEYS).nullable()),
  taxId: nullableSchema,
  bankAccount: z
    .string()
    .trim()
    .min(6, ERROR_MESSAGES.TOO_SHORT)
    .max(50, ERROR_MESSAGES.TOO_LONG)
    .or(z.literal(''))
    .transform((value) => value || null),
  holiday: optionalStringToNumSchema,
});

export type EmployeePartnershipForm = z.input<typeof employeePartnershipSchema>;
export type EmployeePartnershipSchema = z.output<typeof employeePartnershipSchema>;
