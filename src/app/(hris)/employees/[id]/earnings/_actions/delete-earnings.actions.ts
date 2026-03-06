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
import { logger } from '@/shared/service/pino';
import { type DeleteEarningsSchema } from '../_schemas/delete-earnings.schema';

type DeleteFormFields = { id: CUID; employeeId: CUID };

type DeleteEarningsState = {} & ActionReturnType<
  DeleteFormFields,
  undefined,
  ActionReturnValidationErrorsType<DeleteEarningsSchema>
>;

export async function deleteEarnings(state: DeleteEarningsState): Promise<DeleteEarningsState> {
  try {
    const api = hrisApi;
    await api.employees.deleteEmployeeEarnings(state.form.employeeId, state.form.id);

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
