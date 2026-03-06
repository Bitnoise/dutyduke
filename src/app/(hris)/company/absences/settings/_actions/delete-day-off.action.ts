'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { HRIS_ROUTES, type CUID } from '@/shared';

export async function deleteDayOff(absenceIds: CUID[] | 'all') {
  const api = hrisApi;

  await api.absences.deleteAbsence(absenceIds);

  revalidatePath(HRIS_ROUTES.company.absences.settings.base);
}
