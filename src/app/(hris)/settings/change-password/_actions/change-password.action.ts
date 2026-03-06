'use server';

import { revalidatePath } from 'next/cache';
import {
  changePasswordSchema,
  type ChangePasswordForm,
  type ChangePasswordSchema,
} from '@/app/(hris)/settings/change-password/_schemas';
import {
  type ActionReturnValidationErrorsType,
  handleActionError,
  HRIS_ROUTES,
  type ActionReturnType,
} from '@/shared';
import { hrisApi } from '@/api/hris';
import { logger } from '@/shared/service/pino';

type ChangePasswordState = ActionReturnType<
  ChangePasswordForm,
  undefined,
  ActionReturnValidationErrorsType<ChangePasswordSchema>
>;

export async function changePassword(
  prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const form: ChangePasswordForm = {
    oldPassword: formData.get('oldPassword') as string,
    newPassword: formData.get('newPassword') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  const validationResult = changePasswordSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      status: 'validation-error',
      errors: validationResult.error.flatten().fieldErrors,
      form,
    };
  }

  const api = hrisApi;
  try {
    await api.auth.changePasswordWithOldPassword(
      validationResult.data.oldPassword,
      validationResult.data.newPassword,
    );
  } catch (err) {
    logger.info(err);
    return { ...prevState, form, ...handleActionError(err) };
  }

  revalidatePath(HRIS_ROUTES.settings.changePassword);

  return {
    status: 'success',
    data: undefined,
    form: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  };
}
