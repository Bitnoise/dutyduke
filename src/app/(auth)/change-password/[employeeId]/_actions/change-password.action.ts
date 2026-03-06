'use server';

import { redirect } from 'next/navigation';
import { hrisApi } from '@/api/hris';
import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from '@/app/(auth)/change-password/[employeeId]/_schema';
import {
  type ActionReturnType,
  type ActionReturnValidationErrorsType,
  handleActionError,
  HRIS_ROUTES,
} from '@/shared';

type ChangePasswordFormState = ActionReturnType<
  ChangePasswordSchema & { email: string },
  undefined,
  ActionReturnValidationErrorsType<ChangePasswordSchema>
>;

export async function changePassword(
  prevState: ChangePasswordFormState,
  formData: FormData,
): Promise<ChangePasswordFormState> {
  const form: ChangePasswordSchema = {
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
    termsAndServicesAgreement: (formData.get('termsAndServicesAgreement') === 'true') as boolean,
  };

  const validationResult = changePasswordSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      ...prevState,
      form: {
        ...prevState.form,
        ...form,
      },
      status: 'validation-error',
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const api = hrisApi;

  const { password } = validationResult.data;
  try {
    // TODO: Implement agreement update for single organization
    // Previously: await admin.organization.updateUserAgreements(prevState.form.email, termsAndServicesAgreement);

    await api.auth.changePassword({
      email: prevState.form.email,
      password,
    });
  } catch (err) {
    return {
      ...prevState,
      form: {
        ...prevState.form,
        ...form,
      },
      ...handleActionError(err),
    };
  }

  redirect(HRIS_ROUTES.employees.base);
}
