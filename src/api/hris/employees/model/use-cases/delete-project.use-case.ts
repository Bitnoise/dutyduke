import { EMPLOYEE_SKILLS_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { type ProjectDto } from '@/api/hris/employees/model/dtos';
import { type EmployeeSkillsRepository } from '@/api/hris/employees/model/repositories';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function deleteProjectUseCase(repository: EmployeeSkillsRepository) {
  return async (projectId: CUID, employeeId: CUID, projects: ProjectDto[]) => {
    const deletedProject = projects.find((project) => project.id === projectId)!;

    if (!deletedProject) {
      throw new ApiError(404, EMPLOYEE_SKILLS_ERROR_MESSAGES.PROJECTS.NOT_FOUND_BY_ID(projectId));
    }

    try {
      await repository.deleteProject(projectId);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, EMPLOYEE_SKILLS_ERROR_MESSAGES.PROJECTS.DELETE_FAILED);
    }

    try {
      const updatedProjects = projects
        .map((project) => {
          if (project.id === deletedProject.id) return null;

          if (project.order > deletedProject.order) {
            return {
              ...project,
              order: project.order - 1,
            };
          }

          return project;
        })
        .filter(Boolean) as ProjectDto[];

      await repository.updateProjects(employeeId, updatedProjects);
    } catch (err) {
      logger.info(err);
      await repository.addProject(employeeId, deletedProject, deletedProject.order);
      throw new ApiError(500, EMPLOYEE_SKILLS_ERROR_MESSAGES.PROJECTS.DELETE_FAILED);
    }
  };
}
