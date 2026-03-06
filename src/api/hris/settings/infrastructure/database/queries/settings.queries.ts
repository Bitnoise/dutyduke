import { type OrganizationPrismaClient, type DateFormat } from '@/api/hris/prisma/client';
import { type CUID } from '@/shared';
import { DEFAULT_LANGUAGE } from '@/shared/constants/languages';
import { DEFAULT_DATE_FORMAT } from '@/shared/constants/date-formats';

export function settingsQueries(db: OrganizationPrismaClient) {
  const getSettingsById = async (id: CUID) => {
    return db.settings.findUnique({ where: { id } });
  };

  const getSettings = async () => {
    return db.settings.findFirst();
  };

  const getLanguage = async () => {
    const settings = await db.settings.findFirst({ select: { language: true } });

    return settings?.language ?? DEFAULT_LANGUAGE;
  };

  const getDateFormat = async (): Promise<DateFormat> => {
    const settings = await db.settings.findFirst({ select: { dateFormat: true } });

    return settings?.dateFormat ?? (DEFAULT_DATE_FORMAT as DateFormat);
  };

  const getSettingsId = async (): Promise<string | null> => {
    const settings = await db.settings.findFirst({ select: { id: true } });

    return settings?.id ?? null;
  };

  return {
    getSettingsById,
    getSettings,
    getLanguage,
    getDateFormat,
    getSettingsId,
  };
}
