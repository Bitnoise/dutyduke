import { z } from 'zod';
import { ERROR_MESSAGES, requiredSchema } from '@/shared';

export const loginUserSchema = z.object({
  email: z.string().email(ERROR_MESSAGES.INVALID_EMAIL).min(1, ERROR_MESSAGES.REQUIRED),
  password: requiredSchema,
});

export type LoginUserForm = z.input<typeof loginUserSchema>;

export type LoginUserSchema = z.output<typeof loginUserSchema>;
