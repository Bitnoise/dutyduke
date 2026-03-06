'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { HRIS_ROUTES, type CUID } from '@/shared';

export async function deleteProject(projectId: CUID, employeeId: CUID) {
  const api = hrisApi;

  await api.employees.deleteProject(projectId, employeeId);

  revalidatePath(HRIS_ROUTES.employees.skills.base(employeeId));
}
