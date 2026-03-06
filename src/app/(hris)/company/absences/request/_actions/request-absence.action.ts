'use server';

import { revalidatePath } from 'next/cache';
import {
  type ActionReturnValidationErrorsType,
  type ActionReturnType,
  handleActionError,
  HRIS_ROUTES,
} from '@/shared';
import { hrisApi } from '@/api/hris';
import { requestAbsenceSchema, type RequestAbsenceSchema } from '../_schemas/request-absence.schema';

type State = ActionReturnType<
  RequestAbsenceSchema,
  undefined,
  ActionReturnValidationErrorsType<RequestAbsenceSchema>
>;

export async function requestAbsence(prevState: State, formData: FormData): Promise<State> {
  const form = {
    startDate: formData.get('startDate') as string,
    endDate: formData.get('endDate') as string,
    type: formData.get('type') as string,
    description: formData.get('description') as string,
    employeeId: formData.get('employeeId') as string,
  };

  const validationResult = requestAbsenceSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      ...prevState,
      status: 'validation-error',
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const api = hrisApi;
  const reviewer = await api.auth.getMe();
  const {
    data: { employeeId, ...absence },
  } = validationResult;

  try {
    await api.absences.requestAbsence({
      ...absence,
      issuerId: employeeId,
      reviewerId: reviewer.id,
      status: 'APPROVED',
    });
  } catch (err) {
    return {
      ...prevState,
      ...handleActionError(err),
    };
  }

  revalidatePath(HRIS_ROUTES.company.absences.base);

  return {
    ...prevState,
    status: 'success',
    data: undefined,
  };
}
