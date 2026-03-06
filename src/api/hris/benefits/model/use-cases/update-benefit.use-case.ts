import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type BenefitRepository } from '../repositories/benefit.repository.type';
import { type UpdateBenefitDto } from '../dtos/benefit.dtos';
import { BENEFIT_ERRORS } from '../../errors';

export function updateBenefitUseCase(repository: BenefitRepository) {
  return async (benefitId: CUID, data: UpdateBenefitDto): Promise<void> => {
    try {
      await repository.updateBenefit(benefitId, data);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, BENEFIT_ERRORS.UPDATE_FAILED);
    }
  };
}
