import { EMPLOYEE_SKILLS_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { type CreateEducationDto } from '@/api/hris/employees/model/dtos';
import { type EmployeeSkillsRepository } from '@/api/hris/employees/model/repositories';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function addEducationUseCase(repository: EmployeeSkillsRepository) {
  return async (employeeId: CUID, education: CreateEducationDto) => {
    try {
      repository.addEducation(employeeId, education);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, EMPLOYEE_SKILLS_ERROR_MESSAGES.EDUCATION.ADD_FAILED);
    }
  };
}
