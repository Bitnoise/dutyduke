import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { type UpdateSettingsDto, type CreateSettingsDto } from '@/api/hris/settings/model/dtos';
import { type SettingsRepository } from '@/api/hris/settings/model/repositories';
import { type CUID } from '@/shared';

export function settingsRepository(db: OrganizationPrismaClient): SettingsRepository {
  const createSettings = async (settings: CreateSettingsDto) => {
    const createdSettings = await db.settings.create({ data: settings });

    return createdSettings.id;
  };

  const updateSettings = async (id: CUID, settings: UpdateSettingsDto) => {
    await db.settings.update({ where: { id }, data: settings });
  };

  return {
    createSettings,
    updateSettings,
  };
}
