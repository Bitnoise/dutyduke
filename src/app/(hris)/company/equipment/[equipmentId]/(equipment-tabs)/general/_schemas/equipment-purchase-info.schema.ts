import { z } from 'zod';
import { nullableSchema, optionalDateSchema } from '@/shared';

export const equipmentPurchaseInfoSchema = z.object({
  invoiceNumber: nullableSchema,
  supplier: nullableSchema,
  purchaseDate: optionalDateSchema,
  warrantyDuration: nullableSchema.transform((value) => (value ? +value : null)),
  leaseDuration: nullableSchema.transform((value) => (value ? +value : null)),
  value: nullableSchema.transform((value) => (value ? +value : null)),
});

export type EquipmentPurchaseInfoForm = z.input<typeof equipmentPurchaseInfoSchema>;
export type EquipmentPurchaseInfoSchema = z.output<typeof equipmentPurchaseInfoSchema>;
