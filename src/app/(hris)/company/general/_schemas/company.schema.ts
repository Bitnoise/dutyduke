import { z } from 'zod';
import { ERROR_MESSAGES, MAX_FILE_SIZE, nullableSchema, requiredSchema } from '@/shared';

export const companySchema = z.object({
  name: requiredSchema,
  logoId: nullableSchema.or(z.literal(null)),
  logo: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: ERROR_MESSAGES.INVALID_PHOTO_SIZE,
    })
    .transform((file) => (file.size > 0 ? file : null))
    .or(z.literal(null))
    .or(z.string()),
});

export type CompanyForm = z.input<typeof companySchema>;
export type CompanySchema = z.output<typeof companySchema>;
