'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import {
  type EmployeeContactInfoForm,
  employeeContactInfoSchema,
} from '@/app/(hris)/employees/[id]/general/_schemas';
import {
  type ActionReturnType,
  type ActionReturnValidationErrorsType,
  ApiError,
  type CUID,
  ERROR_MESSAGES,
  handleActionError,
  HRIS_ROUTES,
} from '@/shared';

type UpdateEmployeeContactState = ActionReturnType<
  EmployeeContactInfoForm & { employeeId: CUID },
  undefined,
  ActionReturnValidationErrorsType<EmployeeContactInfoForm>
>;

export async function updateEmployeeContactInfo(
  prevState: UpdateEmployeeContactState,
  formData: FormData,
): Promise<UpdateEmployeeContactState> {
  const form: EmployeeContactInfoForm = {
    workEmail: '',
    additionalEmails: formData.get('additionalEmails') as string,
    iceName: formData.get('iceName') as string,
    icePhone: formData.get('icePhone') as string,
    phone: formData.get('phone') as string,
  };

  const contactInfo = employeeContactInfoSchema.safeParse(form);

  if (!contactInfo.success) {
    return {
      ...prevState,
      form: {
        ...prevState.form,
        ...form,
      },
      status: 'validation-error',
      errors: contactInfo.error.flatten().fieldErrors,
    };
  }

  // Omit updating work email
  const { workEmail: _workEmail, ...dataToUpdate } = contactInfo.data;

  try {
    const api = hrisApi;

    await api.employees.updateEmployeeGeneralInfo(prevState.form.employeeId, dataToUpdate);
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      return {
        ...prevState,
        status: 'validation-error',
        errors: {
          additionalEmails: [ERROR_MESSAGES.EMAIL_ALREADY_TAKEN],
        },
      };
    }
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
