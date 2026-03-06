import { EMPLOYEE_SKILLS_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { type EmployeeSkillsRepository } from '@/api/hris/employees/model/repositories';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function deleteEducationUseCase(repository: EmployeeSkillsRepository) {
  return async (educationId: CUID) => {
    try {
      await repository.deleteEducation(educationId);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, EMPLOYEE_SKILLS_ERROR_MESSAGES.EDUCATION.DELETE_FAILED);
    }
  };
}
