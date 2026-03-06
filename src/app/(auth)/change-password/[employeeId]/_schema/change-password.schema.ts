import { z } from 'zod';
import { ERROR_MESSAGES, passwordSchema } from '@/shared';

export const changePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
    termsAndServicesAgreement: z.boolean().refine(
      (arg) => {
        return arg === true;
      },
      {
        message: ERROR_MESSAGES.CHECK_REQUIRED,
      },
    ),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: ERROR_MESSAGES.NOT_MATCHING_PASSWORDS,
    path: ['confirmPassword'],
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
