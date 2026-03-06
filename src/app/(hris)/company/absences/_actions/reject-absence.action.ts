'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { HRIS_ROUTES, type CUID } from '@/shared';

export async function rejectAbsence(absenceId: CUID[] | 'all', reviewerId: CUID) {
  const api = hrisApi;

  await api.absences.rejectAbsence(absenceId, reviewerId);

  revalidatePath(HRIS_ROUTES.company.absences.base);
}
