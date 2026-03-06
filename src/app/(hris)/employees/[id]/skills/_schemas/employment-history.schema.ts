import { z } from 'zod';
import dayjs from 'dayjs';
import {
  nullableSchema,
  optionalDateSchema,
  requiredDateSchema,
  requiredSchema,
  type WithId,
} from '@/shared';

export const employmentHistorySchema = z
  .object({
    startDate: requiredDateSchema,
    endDate: optionalDateSchema,
    role: requiredSchema,
    company: requiredSchema,
    description: nullableSchema,
  })
  .refine(
    ({ startDate, endDate }) => {
      if (!endDate) return true;

      return dayjs(startDate).isBefore(endDate);
    },
    {
      message: 'errorMessages.startDateAfterEndDate',
      path: ['endDate'],
    },
  );

export type EmploymentHistoryForm = z.input<typeof employmentHistorySchema>;

export type EmploymentHistorySchema = WithId<z.output<typeof employmentHistorySchema>>;
