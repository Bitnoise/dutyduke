import { type EquipmentChangelogRepository } from '@/api/hris/resources/model/repository';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { EQUIPMENT_CHANGELOG_ERRORS } from '../../errors';

export function createLogUseCase(repository: EquipmentChangelogRepository) {
  return async <T>(previousState: T, currentState: T, actorId: CUID) => {
    const changes: {
      previous: Partial<Record<keyof T, unknown>>;
      current: Partial<Record<keyof T, unknown>>;
    } = {
      previous: {},
      current: {},
    };

    for (const key in previousState) {
      if (previousState[key] !== currentState[key]) {
        changes.previous[key] = previousState[key];
        changes.current[key] = currentState[key];
      }
    }

    if (!Object.keys(changes.previous).length && !Object.keys(changes.current).length) return;

    try {
      await repository.createLog(actorId, JSON.stringify(changes.previous), JSON.stringify(changes.current));
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, EQUIPMENT_CHANGELOG_ERRORS.CREATE_FAILED);
    }
  };
}
