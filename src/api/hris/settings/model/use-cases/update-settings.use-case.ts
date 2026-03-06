import { SETTINGS_ERRORS } from '@/api/hris/settings/errors';
import { type UpdateSettingsDto } from '@/api/hris/settings/model/dtos';
import { type SettingsRepository } from '@/api/hris/settings/model/repositories';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function updateSettingsUseCase(settingsRepository: SettingsRepository) {
  return async (id: CUID, settings: UpdateSettingsDto) => {
    try {
      await settingsRepository.updateSettings(id, settings);
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, SETTINGS_ERRORS.UPDATE_FAILED);
    }
  };
}
