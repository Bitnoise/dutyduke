'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import {
  assignBenefitsSchema,
  type AssignBenefitsSchema,
} from '@/app/(hris)/company/benefits/_schemas/assign-benefits.schema';
import {
  handleActionError,
  HRIS_ROUTES,
  type ActionReturnType,
  type ActionReturnValidationErrorsType,
} from '@/shared';

type AssignBenefitsActionState = ActionReturnType<
  AssignBenefitsSchema,
  undefined,
  ActionReturnValidationErrorsType<AssignBenefitsSchema>
>;

export async function assignBenefits(
  prevState: AssignBenefitsActionState,
  formData: FormData,
): Promise<AssignBenefitsActionState> {
  const benefitIds = formData.getAll('benefitIds') as string[];
  const employeeIds = formData.getAll('employeeIds') as string[];
  const startDate = formData.get('startDate') as string;

  const form: AssignBenefitsSchema = {
    benefitIds,
    employeeIds,
    startDate: startDate || new Date().toISOString().split('T')[0],
  };

  const validationResult = assignBenefitsSchema.safeParse(form);
  if (!validationResult.success) {
    return {
      ...prevState,
      status: 'validation-error',
      form,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const api = hrisApi;
    const startDateObj = new Date(validationResult.data.startDate);

    await api.benefits.assignBenefitsToEmployees(
      validationResult.data.benefitIds,
      validationResult.data.employeeIds,
      startDateObj,
    );

    revalidatePath(HRIS_ROUTES.benefits.base);

    return {
      ...prevState,
      status: 'success',
      data: undefined,
    };
  } catch (err) {
    return {
      ...prevState,
      ...handleActionError(err),
    };
  }
}
