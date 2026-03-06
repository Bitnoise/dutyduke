import { z } from 'zod';
import { requiredSchema } from '@/shared';

export const employeeChildrenSchema = z.object({
  id: requiredSchema,
  birthDate: requiredSchema.pipe(z.coerce.date()),
  name: requiredSchema,
});

export const employeeOtherFormSchema = z.object({
  hobbies: z.string().transform((value) =>
    value
      .split(',')
      .map((tag) => tag.replace('#', '').trim())
      .filter(Boolean),
  ),
  children: z.array(employeeChildrenSchema),
});

export type EmployeeOtherForm = z.input<typeof employeeOtherFormSchema>;
export type EmployeeOtherSchema = z.output<typeof employeeOtherFormSchema> & {
  photosIds: string[];
  avatarId: string | null;
};
