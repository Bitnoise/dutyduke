import { z } from 'zod';
import { LANGUAGES_KEYS, DATE_FORMAT_KEYS, requiredSchema } from '@/shared';

export const applicationSettingsSchema = z.object({
  language: requiredSchema.pipe(z.enum(LANGUAGES_KEYS as [string, ...string[]])),
  dateFormat: requiredSchema.pipe(z.enum(DATE_FORMAT_KEYS as [string, ...string[]])),
});

export type ApplicationSettingsForm = z.input<typeof applicationSettingsSchema>;
export type ApplicationSettingsSchema = z.output<typeof applicationSettingsSchema>;
