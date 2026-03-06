import { z } from 'zod';
import { ERROR_MESSAGES } from '@/shared/constants';

export const passwordSchema = z
  .string()
  .min(8, ERROR_MESSAGES.INVALID_PASSWORD)
  .max(64, ERROR_MESSAGES.INVALID_PASSWORD);
