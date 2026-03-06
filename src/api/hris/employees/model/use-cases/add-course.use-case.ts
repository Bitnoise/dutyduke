import { EMPLOYEE_SKILLS_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { type CreateCourseDto } from '@/api/hris/employees/model/dtos';
import { type EmployeeSkillsRepository } from '@/api/hris/employees/model/repositories';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function addCourseUseCase(repository: EmployeeSkillsRepository) {
  return async (employeeId: CUID, course: CreateCourseDto) => {
    try {
      repository.addCourse(employeeId, course);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, EMPLOYEE_SKILLS_ERROR_MESSAGES.COURSE.ADD_FAILED);
    }
  };
}
