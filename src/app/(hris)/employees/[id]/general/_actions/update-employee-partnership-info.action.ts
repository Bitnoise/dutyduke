'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import {
  employeePartnershipSchema,
  type EmployeePartnershipForm,
} from '@/app/(hris)/employees/[id]/general/_schemas';
import {
  type ActionReturnType,
  type ActionReturnValidationErrorsType,
  type CUID,
  handleActionError,
  HRIS_ROUTES,
} from '@/shared';
import { logger } from '@/shared/service/pino';

type UpdateEmployeePartnershipInfoState = ActionReturnType<
  EmployeePartnershipForm & { employeeId: CUID },
  undefined,
  ActionReturnValidationErrorsType<EmployeePartnershipForm>
>;

export async function updateEmployeePartnershipInfo(
  prevState: UpdateEmployeePartnershipInfoState,
  formData: FormData,
): Promise<UpdateEmployeePartnershipInfoState> {
  const form: EmployeePartnershipForm = {
    role: formData.get('role') as string,
    employmentType: formData.get('employmentType') as string,
    taxId: formData.get('taxId') as string,
    bankAccount: formData.get('bankAccount') as string,
    holiday: formData.get('holiday') as string,
  };

  const partnershipInfo = employeePartnershipSchema.safeParse(form);

  if (!partnershipInfo.success) {
    return {
      ...prevState,
      form: {
        ...prevState.form,
        ...form,
      },
      status: 'validation-error',
      errors: partnershipInfo.error.flatten().fieldErrors,
    };
  }

  try {
    const api = hrisApi;
    await api.employees.updateEmployeeGeneralInfo(prevState.form.employeeId, partnershipInfo.data);
  } catch (err) {
    logger.info(err);
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
