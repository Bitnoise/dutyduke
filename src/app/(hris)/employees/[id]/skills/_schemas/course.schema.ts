import { z } from 'zod';
import { requiredDateSchema, requiredSchema, type WithId } from '@/shared';

export const courseSchema = z.object({
  date: requiredDateSchema,
  name: requiredSchema,
});

export type CourseSchema = WithId<z.output<typeof courseSchema>>;
export type CourseForm = z.input<typeof courseSchema>;
