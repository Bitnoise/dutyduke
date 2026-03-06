import { z } from 'zod';
import { ERROR_MESSAGES } from '../constants';

export const requiredSchema = z.string().min(1, ERROR_MESSAGES.REQUIRED);
