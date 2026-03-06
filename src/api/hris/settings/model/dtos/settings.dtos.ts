import { type Language, type DateFormat } from '@/api/hris/prisma/client';
import { type WithId } from '@/shared';

export type SettingsDto = WithId<{
  language: Language;
  dateFormat: DateFormat;
}>;

export type CreateSettingsDto = {
  language?: Language;
  dateFormat?: DateFormat;
};

export type UpdateSettingsDto = {
  language: Language;
  dateFormat: DateFormat;
};
