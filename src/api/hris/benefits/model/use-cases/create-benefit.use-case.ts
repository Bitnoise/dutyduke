import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type BenefitRepository } from '../repositories/benefit.repository.type';
import { type CreateBenefitDto } from '../dtos/benefit.dtos';
import { BENEFIT_ERRORS } from '../../errors';

export function createBenefitUseCase(repository: BenefitRepository) {
  return async (benefit: CreateBenefitDto): Promise<CUID> => {
    try {
      return await repository.createBenefit(benefit);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, BENEFIT_ERRORS.CREATE_FAILED);
    }
  };
}
