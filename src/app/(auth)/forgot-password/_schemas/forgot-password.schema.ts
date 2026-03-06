import { z } from 'zod';
import { emailSchema } from '@/shared';

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
