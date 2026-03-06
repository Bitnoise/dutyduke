'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import {
  type ActionReturnValidationErrorsType,
  handleActionError,
  HRIS_ROUTES,
  type ActionReturnType,
  type CUID,
} from '@/shared';
import { type EditEarningsSchema, editEarningsSchema } from '../_schemas/edit-earnings.schema';

type EditEarningsState = ActionReturnType<
  EditEarningsSchema & { id: CUID },
  undefined,
  ActionReturnValidationErrorsType<EditEarningsSchema>
>;

export async function editEarnings(state: EditEarningsState, formData: FormData): Promise<EditEarningsState> {
  const value = formData.get('value') as string;

  const validationResult = editEarningsSchema.safeParse({
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
    await api.employees.editEmployeeEarnings(state.form.employeeId, state.form.id, {
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
    return { ...state, ...handleActionError(err) };
  }
}
