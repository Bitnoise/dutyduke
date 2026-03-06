import { EMPLOYEE_SKILLS_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { type EmployeeSkillsRepository } from '@/api/hris/employees/model/repositories';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function deleteEmploymentHistoryUseCase(repository: EmployeeSkillsRepository) {
  return async (employmentHistoryId: CUID) => {
    try {
      await repository.deleteEmploymentHistory(employmentHistoryId);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, EMPLOYEE_SKILLS_ERROR_MESSAGES.EMPLOYMENT_HISTORY.DELETE_FAILED);
    }
  };
}
