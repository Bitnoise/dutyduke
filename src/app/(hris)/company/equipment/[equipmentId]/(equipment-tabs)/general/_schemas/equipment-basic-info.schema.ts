import { z } from 'zod';
import { ERROR_MESSAGES, MAX_FILE_SIZE, nullableSchema, requiredSchema } from '@/shared';

export const updateEquipmentBasicInfoSchema = z.object({
  category: nullableSchema,
  signature: requiredSchema,
  name: requiredSchema,
  brand: nullableSchema,
  model: nullableSchema,
  status: requiredSchema.pipe(z.enum(['WORKING', 'BROKEN', 'IN_SERVICE', 'ARCHIVED'])),
  location: nullableSchema,
  description: nullableSchema,
  serial: nullableSchema,
  avatarId: z.string().nullable(),
  avatar: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: ERROR_MESSAGES.INVALID_PHOTO_SIZE,
    })
    .transform((file) => (file.size > 0 ? file : null))
    .or(z.string())
    .or(z.null()),
});

export type EquipmentBasicInfoForm = z.input<typeof updateEquipmentBasicInfoSchema>;
export type EquipmentBasicInfoSchema = z.output<typeof updateEquipmentBasicInfoSchema>;
