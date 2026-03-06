import { z } from 'zod';
import dayjs from 'dayjs';
import { requiredDateSchema } from '@/shared';

export const createDayOffSchema = z
  .object({
    startDate: requiredDateSchema,
    endDate: requiredDateSchema,
    description: z.string(),
  })
  .refine(
    ({ startDate, endDate }) => {
      return startDate && endDate ? !dayjs(endDate).isBefore(startDate) : true;
    },
    {
      message: 'errorMessages.startDateAfterEndDate',
      path: ['endDate'],
    },
  );

export type CreateDayOffSchema = z.input<typeof createDayOffSchema>;
