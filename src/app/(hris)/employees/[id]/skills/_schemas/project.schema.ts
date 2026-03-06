import { z } from 'zod';
import dayjs from 'dayjs';
import {
  nullableSchema,
  optionalDateSchema,
  requiredDateSchema,
  requiredSchema,
  type WithId,
} from '@/shared';

export const projectSchema = z
  .object({
    startDate: requiredDateSchema,
    endDate: optionalDateSchema,
    name: requiredSchema,
    role: requiredSchema,
    description: nullableSchema,
    isVisible: z.boolean(),
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

export type ProjectForm = z.input<typeof projectSchema>;
export type ProjectSchema = WithId<z.output<typeof projectSchema>> & { order: number };
