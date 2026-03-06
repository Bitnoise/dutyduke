'use server';
import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { ApiError, type CUID, HRIS_ROUTES } from '@/shared';
import { EMPLOYEE_SKILLS_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { logger } from '@/shared/service/pino';

export async function changeProjectOrder(projectId: CUID, employeeId: CUID, formData: FormData) {
  const dir = formData.has('up') ? 'up' : 'down';

  const api = hrisApi;

  try {
    await api.employees.changeProjectOrder(projectId, employeeId, dir);

    revalidatePath(HRIS_ROUTES.employees.skills.base(employeeId));
  } catch (err) {
    logger.info(err);
    throw new ApiError(500, EMPLOYEE_SKILLS_ERROR_MESSAGES.PROJECTS.UPDATE_FAILED);
  }
}
