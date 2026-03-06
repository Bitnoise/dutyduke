'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import {
  type EducationForm,
  educationSchema,
  type EducationSchema,
} from '@/app/(hris)/employees/[id]/skills/_schemas';
import {
  type CUID,
  type ActionReturnType,
  type ActionReturnValidationErrorsType,
  handleActionError,
  HRIS_ROUTES,
} from '@/shared';

type Form = EducationForm & { educationId: CUID; employeeId: CUID };

type AddEducationActionState = ActionReturnType<
  Form,
  undefined,
  ActionReturnValidationErrorsType<EducationSchema>
>;

export async function addEducation(
  prevState: AddEducationActionState,
  formData: FormData,
): Promise<AddEducationActionState> {
  const form: Form = {
    startDate: formData.get('startDate') as string,
    endDate: formData.get('endDate') as string,
    name: formData.get('name') as string,
    employeeId: prevState.form.employeeId,
    educationId: prevState.form.educationId,
  };

  const validationResult = educationSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      status: 'validation-error',
      errors: validationResult.error.flatten().fieldErrors,
      form,
    };
  }

  const api = hrisApi;

  try {
    await api.employees.addEducation(form.employeeId, validationResult.data);

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
