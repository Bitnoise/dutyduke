import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type AbsenceRepository } from '../repositories/absence.repository';

export function deleteAbsenceUseCase(repository: AbsenceRepository) {
  return async (absenceIds: CUID[] | 'all') => {
    try {
      await repository.deleteAbsence(absenceIds === 'all' ? undefined : absenceIds);
    } catch (err) {
      logger.error(err);
      throw new ApiError(500, 'Failed to delete absence');
    }
  };
}
