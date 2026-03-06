'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { HRIS_ROUTES, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export async function deleteFeedbackAction(feedbackId: CUID, employeeId: CUID): Promise<void> {
  try {
    const api = hrisApi;
    await api.feedback.deleteFeedback(feedbackId);

    revalidatePath(HRIS_ROUTES.employees.feedback.base(employeeId));
  } catch (err) {
    logger.info(err);
    throw err;
  }
}
