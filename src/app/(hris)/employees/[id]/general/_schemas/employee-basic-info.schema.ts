import { z } from 'zod';
import { optionalDateSchema, requiredSchema } from '@/shared';

export const employeeBasicInfoSchema = z.object({
  firstName: requiredSchema,
  lastName: requiredSchema,
  personalId: z.string().nullable(),
  birthdate: optionalDateSchema,
});

export type EmployeeBasicInfoForm = z.input<typeof employeeBasicInfoSchema>;
export type EmployeeBasicInfoSchema = z.output<typeof employeeBasicInfoSchema>;
