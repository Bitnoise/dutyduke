'use server';

import {
  type ChangePasswordSchema,
  changePasswordSchema,
} from '@/app/(auth)/forgot-password/[token]/_schemas';
import { type ActionReturnValidationErrorsType, handleActionError, type ActionReturnType } from '@/shared';
import { hrisApi } from '@/api/hris';

type Form = {
  password: string;
  confirmPassword: string;
  token: string;
};

type ChangePasswordActionState = ActionReturnType<
  Form,
  undefined,
  ActionReturnValidationErrorsType<ChangePasswordSchema>
>;

export async function changePassword(
  prevState: ChangePasswordActionState,
  formData: FormData,
): Promise<ChangePasswordActionState> {
  const form: Form = {
    token: prevState.form.token,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  const changePasswordValidationResult = changePasswordSchema.safeParse(form);

  if (!changePasswordValidationResult.success) {
    return {
      status: 'validation-error',
      form,
      errors: changePasswordValidationResult.error.flatten().fieldErrors,
    };
  }

  const api = hrisApi;

  try {
    await api.auth.validateChangePasswordToken({
      token: form.token,
      password: changePasswordValidationResult.data.password,
    });
  } catch (err) {
    return { ...prevState, ...handleActionError(err) };
  }

  return {
    status: 'success',
    form,
    data: undefined,
  };
}
