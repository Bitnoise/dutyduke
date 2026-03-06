'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { type CUID, HRIS_ROUTES } from '@/shared';

type ActionState = {
  employeeId: CUID;
  photoId: CUID;
};

export async function setEmployeeAvatar({ employeeId, photoId }: ActionState) {
  const api = hrisApi;

  await api.employees.setEmployeeAvatar(employeeId, photoId);

  revalidatePath(HRIS_ROUTES.employees.general.base(employeeId), 'layout');
}
