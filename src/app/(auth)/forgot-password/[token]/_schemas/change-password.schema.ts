import { z } from 'zod';
import { ERROR_MESSAGES, passwordSchema, requiredSchema } from '@/shared';

export const changePasswordSchema = z
  .object({
    token: requiredSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: ERROR_MESSAGES.NOT_MATCHING_PASSWORDS,
    path: ['confirmPassword'],
  });

export type ChangePasswordSchema = z.input<typeof changePasswordSchema>;
