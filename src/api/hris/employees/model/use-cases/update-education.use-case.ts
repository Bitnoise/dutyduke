import { EMPLOYEE_SKILLS_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { type UpdateEducationDto } from '@/api/hris/employees/model/dtos';
import { type EmployeeSkillsRepository } from '@/api/hris/employees/model/repositories';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function updateEducationUseCase(repository: EmployeeSkillsRepository) {
  return async (educationId: CUID, project: UpdateEducationDto) => {
    try {
      await repository.updateEducation(educationId, project);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, EMPLOYEE_SKILLS_ERROR_MESSAGES.EDUCATION.UPDATE_FAILED);
    }
  };
}
