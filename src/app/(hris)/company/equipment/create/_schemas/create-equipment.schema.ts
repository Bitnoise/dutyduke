import { z } from 'zod';
import { optionalDateSchema, ERROR_MESSAGES, MAX_FILE_SIZE, nullableSchema, requiredSchema } from '@/shared';

export const createEquipmentSchema = z.object({
  category: requiredSchema,
  signature: requiredSchema,
  name: requiredSchema,
  brand: nullableSchema,
  model: nullableSchema,
  status: requiredSchema.pipe(z.enum(['WORKING', 'BROKEN', 'IN_SERVICE', 'ARCHIVED'])),
  location: nullableSchema,
  description: nullableSchema,
  serial: nullableSchema,
  avatar: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: ERROR_MESSAGES.INVALID_PHOTO_SIZE,
    })
    .transform((file) => (file.size > 0 ? file : undefined))
    .or(z.string())
    .or(z.literal(undefined))
    .or(z.literal(null)),
  invoiceNumber: nullableSchema,
  supplier: nullableSchema,
  purchaseDate: optionalDateSchema,
  warrantyDuration: nullableSchema.transform((value) => (value ? +value : null)),
  leaseDuration: nullableSchema.transform((value) => (value ? +value : null)),
  value: nullableSchema.transform((value) => (value ? +value : null)),
});

export type CreateEquipmentForm = z.input<typeof createEquipmentSchema>;
export type CreateEquipmentSchema = z.output<typeof createEquipmentSchema>;
