import { type SettingsRepository } from '@/api/hris/settings/model/repositories';
import { ApiError } from '@/shared';
import { SETTINGS_ERRORS } from '@/api/hris/settings/errors';
import { logger } from '@/shared/service/pino';
import { type CreateSettingsDto } from './../dtos/settings.dtos';

export function createSettingsUseCase(settingsRepository: SettingsRepository) {
  return async (settings: CreateSettingsDto) => {
    try {
      await settingsRepository.createSettings(settings);
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, SETTINGS_ERRORS.CREATE_FAILED);
    }
  };
}
