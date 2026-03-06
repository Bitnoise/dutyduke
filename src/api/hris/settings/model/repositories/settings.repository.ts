import { type CreateSettingsDto, type UpdateSettingsDto } from '@/api/hris/settings/model/dtos';
import { type CUID } from '@/shared';

export type SettingsRepository = {
  updateSettings(id: CUID, settings: UpdateSettingsDto): Promise<void>;
  createSettings(settings: CreateSettingsDto): Promise<CUID>;
};
