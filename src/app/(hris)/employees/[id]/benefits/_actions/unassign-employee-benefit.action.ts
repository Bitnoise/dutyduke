'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { HRIS_ROUTES, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export async function unassignEmployeeBenefitAction(
  employeeBenefitId: CUID,
  employeeId: CUID,
): Promise<void> {
  try {
    const api = hrisApi;
    await api.benefits.unassignBenefit(employeeBenefitId);

    revalidatePath(HRIS_ROUTES.employees.benefits.base(employeeId));
  } catch (err) {
    logger.info(err);
    throw err;
  }
}
