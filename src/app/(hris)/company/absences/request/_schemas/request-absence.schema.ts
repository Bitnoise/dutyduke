import { z } from 'zod';
import dayjs from 'dayjs';
import { requiredDateSchema, requiredSchema } from '@/shared';

export const requestAbsenceSchema = z
  .object({
    startDate: requiredDateSchema,
    endDate: requiredDateSchema,
    type: z.enum(['HOLIDAY', 'SICK', 'PERSONAL'] as const),
    description: z.string(),
    employeeId: requiredSchema,
  })
  .refine(
    ({ startDate, endDate }) => {
      if (!endDate) return true;

      const start = dayjs(startDate);
      const end = dayjs(endDate);

      return start.isBefore(end) || start.isSame(end);
    },
    {
      message: 'errorMessages.startDateAfterEndDate',
      path: ['endDate'],
    },
  );

export type RequestAbsenceSchema = z.input<typeof requestAbsenceSchema>;
