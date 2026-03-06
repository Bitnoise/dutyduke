import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type BenefitRepository } from '../repositories/benefit.repository.type';
import { BENEFIT_ERRORS } from '../../errors';

export function unassignBenefitUseCase(repository: BenefitRepository) {
  return async (employeeBenefitId: CUID): Promise<void> => {
    try {
      await repository.unassignBenefit(employeeBenefitId);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, BENEFIT_ERRORS.UNASSIGN_FAILED);
    }
  };
}
