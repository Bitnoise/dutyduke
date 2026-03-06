'use server';

import { revalidatePath } from 'next/cache';
import {
  type ActionReturnValidationErrorsType,
  type ActionReturnType,
  handleActionError,
  type CUID,
} from '@/shared';
import { hrisApi } from '@/api/hris';
import { HRIS_ROUTES } from '@/shared/constants/routes';
import { logger } from '@/shared/service/pino';
import { editBenefitSchema, type EditBenefitSchema } from '../_schemas/edit-benefit.schema';

export type UpdateBenefitState = ActionReturnType<
  EditBenefitSchema,
  undefined,
  ActionReturnValidationErrorsType<EditBenefitSchema>
>;

export async function updateBenefitAction(
  prevState: UpdateBenefitState,
  formData: FormData,
  benefitId: CUID,
): Promise<UpdateBenefitState> {
  const form = {
    name: formData.get('name') as string,
    note: (formData.get('note') as string) || undefined,
  };

  const validationResult = editBenefitSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      ...prevState,
      status: 'validation-error' as const,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const api = hrisApi;

  try {
    await api.benefits.updateBenefit(benefitId, validationResult.data);
  } catch (err) {
    logger.info(err);
    return {
      ...prevState,
      form,
      ...handleActionError(err),
    };
  }

  revalidatePath(HRIS_ROUTES.benefits.base);

  return {
    ...prevState,
    form,
    status: 'success',
    data: undefined,
  };
}
