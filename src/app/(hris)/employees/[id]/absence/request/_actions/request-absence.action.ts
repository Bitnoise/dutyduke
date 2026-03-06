'use server';

import {
  type ActionReturnValidationErrorsType,
  type ActionReturnType,
  handleActionError,
  type CUID,
} from '@/shared';
import { hrisApi } from '@/api/hris';
import { requestAbsenceSchema, type RequestAbsenceInputSchema } from '../_schemas/request-absence.schema';

type State = ActionReturnType<
  RequestAbsenceInputSchema & { employeeId: CUID },
  undefined,
  ActionReturnValidationErrorsType<RequestAbsenceInputSchema>
>;

export async function requestAbsence(prevState: State, formData: FormData): Promise<State> {
  const form = {
    startDate: formData.get('startDate') as string,
    endDate: formData.get('endDate') as string,
    type: formData.get('type') as string,
    description: formData.get('description') as string,
  };

  const validationResult = requestAbsenceSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      ...prevState,
      status: 'validation-error',
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const {
    data: { startDate, endDate, type, description },
  } = validationResult;

  const api = hrisApi;

  try {
    await api.absences.requestAbsence({
      startDate,
      endDate,
      type,
      description,
      issuerId: prevState.form.employeeId,
    });
  } catch (err) {
    return {
      ...prevState,
      ...handleActionError(err),
    };
  }

  return {
    ...prevState,
    status: 'success',
    data: undefined,
  };
}
