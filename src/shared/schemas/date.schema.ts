import { z } from 'zod';
import { ERROR_MESSAGES } from '@/shared/constants';

export const dateSchema = z.string().date(ERROR_MESSAGES.INVALID_DATE);

export const optionalDateSchema = z
  .string()
  .date()
  .or(z.string())
  .transform((value) => (value ? new Date(value) : null));

export const requiredDateSchema = z
  .string()
  .date(ERROR_MESSAGES.REQUIRED)
  .pipe(z.coerce.date({ invalid_type_error: ERROR_MESSAGES.REQUIRED }));
