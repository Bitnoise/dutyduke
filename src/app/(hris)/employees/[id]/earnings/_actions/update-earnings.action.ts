'use server';

import { revalidatePath } from 'next/cache';
import {
  type ActionReturnType,
  type ActionReturnValidationErrorsType,
  handleActionError,
  HRIS_ROUTES,
} from '@/shared';
import { hrisApi } from '@/api/hris';
import { logger } from '@/shared/service/pino';
import { updateEarningsSchema, type UpdateEarningsSchema } from '../_schemas/update-earnings.schema';

type UpdateEarningsState = ActionReturnType<
  UpdateEarningsSchema & { employeeId: string },
  undefined,
  ActionReturnValidationErrorsType<UpdateEarningsSchema>
>;

export async function updateEarnings(
  state: UpdateEarningsState,
  formData: FormData,
): Promise<UpdateEarningsState> {
  const value = formData.get('value') as string;

  const validationResult = updateEarningsSchema.safeParse({
    value,
    date: formData.get('date'),
    description: formData.get('description'),
    employeeId: state.form.employeeId,
  });

  if (!validationResult.success) {
    return {
      ...state,
      status: 'validation-error',
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const api = hrisApi;
    await api.employees.updateEmployeeEarnings(state.form.employeeId, {
      ...validationResult.data,
      value,
    });

    revalidatePath(HRIS_ROUTES.employees.earnings.base(state.form.employeeId));

    return {
      ...state,
      data: undefined,
      status: 'success',
    };
  } catch (err) {
    logger.info(err);
    return { ...state, ...handleActionError(err) };
  }
}
