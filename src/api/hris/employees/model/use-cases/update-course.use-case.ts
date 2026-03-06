import { EMPLOYEE_SKILLS_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { type UpdateCourseDto } from '@/api/hris/employees/model/dtos';
import { type EmployeeSkillsRepository } from '@/api/hris/employees/model/repositories';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function updateCourseUseCase(repository: EmployeeSkillsRepository) {
  return async (courseId: CUID, course: UpdateCourseDto) => {
    try {
      repository.updateCourse(courseId, course);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, EMPLOYEE_SKILLS_ERROR_MESSAGES.COURSE.UPDATE_FAILED);
    }
  };
}
