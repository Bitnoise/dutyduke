'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { HRIS_ROUTES, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export async function deleteBenefitAction(benefitId: CUID): Promise<void> {
  try {
    const api = hrisApi;
    await api.benefits.deleteBenefit(benefitId);

    revalidatePath(HRIS_ROUTES.benefits.base);
  } catch (err) {
    logger.info(err);
    throw err;
  }
}
