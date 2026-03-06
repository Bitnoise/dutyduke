import { z } from 'zod';
import dayjs from 'dayjs';
import { requiredDateSchema } from '@/shared';

export const requestAbsenceSchema = z
  .object({
    startDate: requiredDateSchema,
    endDate: requiredDateSchema,
    type: z.enum(['HOLIDAY', 'SICK', 'PERSONAL'] as const),
    description: z.string(),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (end.isBefore(start)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'errorMessages.startDateAfterEndDate',
        path: ['endDate'],
      });
    }
  });

export type RequestAbsenceInputSchema = z.input<typeof requestAbsenceSchema>;
export type RequestAbsenceInputOutput = z.output<typeof requestAbsenceSchema>;
