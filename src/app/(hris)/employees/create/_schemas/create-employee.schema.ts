import { z } from 'zod';
import {
  EMPLOYMENT_TYPES_KEYS,
  ERROR_MESSAGES,
  nullableSchema,
  optionalDateSchema,
  optionalStringToNumSchema,
  requiredSchema,
} from '@/shared';
import { BANK_ACCOUNT_LENGTH } from '@/shared/constants/bank-account-length';

export const employeeCreationSchema = z.object({
  firstName: requiredSchema,
  lastName: requiredSchema,
  workEmail: z.string().email(ERROR_MESSAGES.INVALID_EMAIL).min(1, ERROR_MESSAGES.REQUIRED),
  joinDate: optionalDateSchema,
  role: z.string().optional(),
  employmentType: nullableSchema.pipe(z.enum(EMPLOYMENT_TYPES_KEYS).nullable()),
  taxId: nullableSchema,
  holiday: optionalStringToNumSchema,
  firstYearHoliday: optionalStringToNumSchema,
  bankAccount: z
    .string()
    .trim()
    .min(BANK_ACCOUNT_LENGTH.min, ERROR_MESSAGES.TOO_SHORT)
    .max(BANK_ACCOUNT_LENGTH.max, ERROR_MESSAGES.TOO_LONG)
    .or(z.literal(''))
    .transform((value) => value || null),
});

export type EmployeeCreationForm = z.input<typeof employeeCreationSchema>;
export type EmployeeCreationSchema = z.output<typeof employeeCreationSchema>;
