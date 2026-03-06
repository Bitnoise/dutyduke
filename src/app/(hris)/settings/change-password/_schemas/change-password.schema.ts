import { z } from 'zod';
import { ERROR_MESSAGES, passwordSchema } from '@/shared';

export const changePasswordSchema = z
  .object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: ERROR_MESSAGES.NOT_MATCHING_PASSWORDS,
    path: ['confirmPassword'],
  });

export type ChangePasswordForm = z.input<typeof changePasswordSchema>;
export type ChangePasswordSchema = z.output<typeof changePasswordSchema>;
