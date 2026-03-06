import { z } from 'zod';
import { ERROR_MESSAGES } from '@/shared';

export const employeeContactInfoSchema = z.object({
  workEmail: z.string(),
  additionalEmails: z.string().transform((value) =>
    value
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  ),
  iceName: z.string().transform((value) => value || null),
  icePhone: z
    .string()
    .refine(
      (value) => (value ? value.length >= 9 && value.length <= 12 : true),
      ERROR_MESSAGES.INVALID_PHONE_NUMBER,
    )
    .transform((value) => value || null),
  phone: z
    .string()
    .refine(
      (value) => (value ? value.length >= 9 && value.length <= 12 : true),
      ERROR_MESSAGES.INVALID_PHONE_NUMBER,
    )
    .transform((value) => value || null),
});

export type EmployeeContactInfoForm = z.input<typeof employeeContactInfoSchema>;
export type EmployeeContactInfoSchema = z.output<typeof employeeContactInfoSchema>;
