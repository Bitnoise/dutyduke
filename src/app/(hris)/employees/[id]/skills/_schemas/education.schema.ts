import { z } from 'zod';
import dayjs from 'dayjs';
import { optionalDateSchema, requiredDateSchema, requiredSchema, type WithId } from '@/shared';

export const educationSchema = z
  .object({
    startDate: requiredDateSchema,
    endDate: optionalDateSchema,
    name: requiredSchema,
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

export type EducationForm = z.input<typeof educationSchema>;
export type EducationSchema = WithId<z.output<typeof educationSchema>>;
