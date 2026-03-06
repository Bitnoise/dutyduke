import { EMPLOYEE_SKILLS_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { type UpdateProjectDto } from '@/api/hris/employees/model/dtos';
import { type EmployeeSkillsRepository } from '@/api/hris/employees/model/repositories';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function updateProjectUseCase(repository: EmployeeSkillsRepository) {
  return async (projectId: CUID, project: Omit<UpdateProjectDto, 'order'>) => {
    try {
      await repository.updateProject(projectId, project);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, EMPLOYEE_SKILLS_ERROR_MESSAGES.PROJECTS.UPDATE_FAILED);
    }
  };
}
