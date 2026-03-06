import { z } from 'zod';

export const optionalStringToNumSchema = z
  .string()
  .trim()
  .or(z.literal(''))
  .transform((val) => (val ? parseInt(val) : null));
