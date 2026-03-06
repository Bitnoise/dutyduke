import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type BenefitRepository } from '../repositories/benefit.repository.type';
import { BENEFIT_ERRORS } from '../../errors';

export function deleteBenefitUseCase(repository: BenefitRepository) {
  return async (benefitId: CUID): Promise<void> => {
    try {
      await repository.deleteBenefit(benefitId);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, BENEFIT_ERRORS.DELETE_FAILED);
    }
  };
}
