import { EMPLOYEE_SKILLS_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { type ProjectDto, type CreateProjectDto } from '@/api/hris/employees/model/dtos';
import { type EmployeeSkillsRepository } from '@/api/hris/employees/model/repositories';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function addProjectUseCase(repository: EmployeeSkillsRepository) {
  return async (employeeId: CUID, project: CreateProjectDto, projects: ProjectDto[]) => {
    try {
      repository.addProject(employeeId, project, projects.length + 1);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, EMPLOYEE_SKILLS_ERROR_MESSAGES.PROJECTS.ADD_FAILED);
    }
  };
}
