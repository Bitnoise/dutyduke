import { z } from 'zod';

export const createDictionaryEntitySchema = z.object({
  name: z.string().min(3),
});

export type CreateDictionaryEntitySchema = z.infer<typeof createDictionaryEntitySchema>;
