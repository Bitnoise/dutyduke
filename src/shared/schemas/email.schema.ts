import { z } from 'zod';
import { ERROR_MESSAGES } from '../constants';

export const emailSchema = z.string().email(ERROR_MESSAGES.INVALID_EMAIL);
export const optionalEmailSchema = z.union([z.literal(''), emailSchema]);
