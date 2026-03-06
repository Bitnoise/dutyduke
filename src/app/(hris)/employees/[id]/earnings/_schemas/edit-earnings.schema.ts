import { z } from 'zod';
import { ERROR_MESSAGES, requiredSchema } from '@/shared';

export const editEarningsSchema = z.object({
  employeeId: requiredSchema,
  value: z
    .union([
      z.string().min(1, ERROR_MESSAGES.REQUIRED),
      z.number({
        invalid_type_error: ERROR_MESSAGES.CURRENCY.INVALID_INPUT,
      }),
    ])
    .pipe(
      z.coerce
        .number({
          invalid_type_error: ERROR_MESSAGES.CURRENCY.INVALID_INPUT,
        })
        .min(0.01, ERROR_MESSAGES.CURRENCY.TOO_SMALL)
        .max(999999999, ERROR_MESSAGES.CURRENCY.TOO_BIG),
    ),
  date: requiredSchema,
  description: z.string(),
});

export type EditEarningsSchema = z.input<typeof editEarningsSchema>;
