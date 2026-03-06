'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import {
  type EmploymentHistoryForm,
  employmentHistorySchema,
  type EmploymentHistorySchema,
} from '@/app/(hris)/employees/[id]/skills/_schemas';
import {
  type CUID,
  type ActionReturnType,
  type ActionReturnValidationErrorsType,
  handleActionError,
  HRIS_ROUTES,
} from '@/shared';

type Form = EmploymentHistoryForm & { employmentHistoryId: CUID; employeeId: CUID };

type UpdateEmploymentHistoryActionState = ActionReturnType<
  Form,
  undefined,
  ActionReturnValidationErrorsType<EmploymentHistorySchema>
>;

export async function updateEmploymentHistory(
  prevState: UpdateEmploymentHistoryActionState,
  formData: FormData,
): Promise<UpdateEmploymentHistoryActionState> {
  const form: Form = {
    startDate: formData.get('startDate') as string,
    endDate: formData.get('endDate') as string,
    company: formData.get('company') as string,
    role: formData.get('role') as string,
    description: formData.get('description') as string,
    employeeId: prevState.form.employeeId,
    employmentHistoryId: prevState.form.employmentHistoryId,
  };

  const validationResult = employmentHistorySchema.safeParse(form);

  if (!validationResult.success) {
    return {
      status: 'validation-error',
      errors: validationResult.error.flatten().fieldErrors,
      form,
    };
  }

  const api = hrisApi;

  try {
    await api.employees.updateEmploymentHistory(
      form.employeeId,
      form.employmentHistoryId,
      validationResult.data,
    );

    revalidatePath(HRIS_ROUTES.employees.skills.base(form.employeeId));

    return {
      ...prevState,
      status: 'success',
      form,
      data: undefined,
    };
  } catch (err) {
    return {
      ...prevState,
      ...handleActionError(err),
    };
  }
}
