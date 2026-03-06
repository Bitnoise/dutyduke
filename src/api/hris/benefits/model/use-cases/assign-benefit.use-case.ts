import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type BenefitRepository } from '../repositories/benefit.repository.type';
import { BENEFIT_ERRORS } from '../../errors';

export function assignBenefitUseCase(repository: BenefitRepository) {
  return async (benefitId: CUID, employeeId: CUID, startDate: Date): Promise<void> => {
    // Check if already assigned
    const existing = await repository.getEmployeeBenefitByBenefitAndEmployee(benefitId, employeeId);

    if (existing) {
      throw new ApiError(409, BENEFIT_ERRORS.ALREADY_ASSIGNED);
    }

    try {
      await repository.assignBenefit(benefitId, employeeId, startDate);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, BENEFIT_ERRORS.ASSIGN_FAILED);
    }
  };
}
