'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import {
  type EmployeeBasicInfoForm,
  employeeBasicInfoSchema,
} from '@/app/(hris)/employees/[id]/general/_schemas';
import {
  type ActionReturnType,
  type ActionReturnValidationErrorsType,
  type CUID,
  handleActionError,
  HRIS_ROUTES,
} from '@/shared';

type UpdateEmployeeBasicInfoState = ActionReturnType<
  EmployeeBasicInfoForm & { employeeId: CUID },
  undefined,
  ActionReturnValidationErrorsType<EmployeeBasicInfoForm>
>;

export async function updateEmployeeBasicInfo(
  prevState: UpdateEmployeeBasicInfoState,
  formData: FormData,
): Promise<UpdateEmployeeBasicInfoState> {
  const form: EmployeeBasicInfoForm = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    personalId: formData.get('personalId') as string,
    birthdate: formData.get('birthdate') as string,
  };

  const basicInfo = employeeBasicInfoSchema.safeParse(form);

  if (!basicInfo.success) {
    return {
      ...prevState,
      form: {
        ...prevState.form,
        ...form,
      },
      status: 'validation-error',
      errors: basicInfo.error.flatten().fieldErrors,
    };
  }

  try {
    const api = hrisApi;

    await api.employees.updateEmployeeGeneralInfo(prevState.form.employeeId, basicInfo.data);
  } catch (err) {
    return { ...prevState, ...handleActionError(err) };
  }

  revalidatePath(HRIS_ROUTES.employees.general.base(prevState.form.employeeId));

  return {
    ...prevState,
    status: 'success',
    form: {
      ...prevState.form,
      ...form,
    },
    data: undefined,
  };
}
