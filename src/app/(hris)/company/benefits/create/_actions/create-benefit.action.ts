'use server';

import { revalidatePath } from 'next/cache';
import { type ActionReturnValidationErrorsType, type ActionReturnType, handleActionError } from '@/shared';
import { hrisApi } from '@/api/hris';
import { HRIS_ROUTES } from '@/shared/constants/routes';
import { createBenefitSchema, type CreateBenefitSchema } from '../_schemas/create-benefit.schema';

type State = ActionReturnType<
  CreateBenefitSchema,
  undefined,
  ActionReturnValidationErrorsType<CreateBenefitSchema>
>;

export async function createBenefit(prevState: State, formData: FormData): Promise<State> {
  const createErrorState = (errors: { [key in keyof CreateBenefitSchema]?: string[] | undefined }) => ({
    ...prevState,
    status: 'validation-error' as const,
    errors,
  });

  const form = {
    name: formData.get('name') as string,
    note: (formData.get('note') as string) || undefined,
  };

  const validationResult = createBenefitSchema.safeParse(form);

  if (!validationResult.success) {
    return createErrorState(validationResult.error.flatten().fieldErrors);
  }

  const api = hrisApi;

  try {
    await api.benefits.createBenefit(validationResult.data);
  } catch (err) {
    return {
      ...prevState,
      ...handleActionError(err),
    };
  }

  revalidatePath(HRIS_ROUTES.benefits.base);

  return {
    ...prevState,
    status: 'success',
    data: undefined,
  };
}
