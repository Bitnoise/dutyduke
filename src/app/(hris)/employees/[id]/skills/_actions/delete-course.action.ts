'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { HRIS_ROUTES, type CUID } from '@/shared';

export async function deleteCourse(courseId: CUID, employeeId: CUID) {
  const api = hrisApi;

  await api.employees.deleteCourse(employeeId, courseId);

  revalidatePath(HRIS_ROUTES.employees.skills.base(employeeId));
}
