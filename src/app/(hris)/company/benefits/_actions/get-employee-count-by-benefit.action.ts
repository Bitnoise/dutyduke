'use server';

import { hrisApi } from '@/api/hris';
import { type CUID } from '@/shared';

export async function getEmployeeCountByBenefitAction(benefitId: CUID): Promise<number> {
  const api = hrisApi;
  return await api.benefits.getEmployeeCountByBenefitId(benefitId);
}
