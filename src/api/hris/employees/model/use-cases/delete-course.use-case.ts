import { EMPLOYEE_SKILLS_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { type EmployeeSkillsRepository } from '@/api/hris/employees/model/repositories';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function deleteCourseUseCase(repository: EmployeeSkillsRepository) {
  return async (courseId: CUID) => {
    try {
      repository.deleteCourse(courseId);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, EMPLOYEE_SKILLS_ERROR_MESSAGES.COURSE.DELETE_FAILED);
    }
  };
}
