import { EMPLOYEE_SKILLS_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { type ProjectDto } from '@/api/hris/employees/model/dtos';
import { type EmployeeSkillsRepository } from '@/api/hris/employees/model/repositories';
import { ApiError, type Direction, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function changeProjectOrderUseCase(repository: EmployeeSkillsRepository) {
  return async (projectId: CUID, employeeId: CUID, projects: ProjectDto[], dir: Direction) => {
    const projectToUpdate = projects.find((project) => project.id === projectId);

    if (!projectToUpdate) {
      throw new ApiError(404, EMPLOYEE_SKILLS_ERROR_MESSAGES.PROJECTS.NOT_FOUND_BY_ID(projectId));
    }

    const currentOrder = projectToUpdate.order;
    const updatedOrder = projectToUpdate.order + (dir === 'up' ? -1 : 1);

    // don't update order of projects on the edges of the array
    if ((currentOrder <= 1 && dir === 'up') || (currentOrder >= projects.length && dir === 'down')) {
      return;
    }

    const updatedProjects = projects.map((project) => {
      if (project.order === updatedOrder) {
        return { ...project, order: currentOrder };
      }

      if (project.order === currentOrder) {
        return { ...project, order: updatedOrder };
      }

      return project;
    });
    try {
      await repository.updateProjects(employeeId, updatedProjects);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, EMPLOYEE_SKILLS_ERROR_MESSAGES.PROJECTS.UPDATE_FAILED);
    }
  };
}
