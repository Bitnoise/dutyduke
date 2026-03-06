'use server';

import { type ActionReturnType, type ActionReturnValidationErrorsType, handleActionError } from '@/shared';

import { hrisApi } from '@/api/hris';
import { logger } from '@/shared/service/pino';
import { forgotPasswordSchema, type ForgotPasswordSchema } from '../_schemas/forgot-password.schema';

type ForgotPasswordActionState = ActionReturnType<
  ForgotPasswordSchema,
  { email: string },
  ActionReturnValidationErrorsType<ForgotPasswordSchema>
>;

export async function forgotPassword(
  state: ForgotPasswordActionState,
  formData: FormData,
): Promise<ForgotPasswordActionState> {
  const form = {
    email: formData.get('email') as string,
  };

  try {
    const authUser = forgotPasswordSchema.safeParse(form);

    if (!authUser.success) {
      return { ...state, status: 'validation-error', errors: authUser.error.flatten().fieldErrors };
    }

    const email = authUser.data.email;
    const api = hrisApi;

    // Single organization - no subdomain lookup needed
    await api.auth.createChangePasswordRequest(email);

    return { ...state, status: 'success', data: { email } };
  } catch (err) {
    logger.info(err);
    return { ...state, ...handleActionError(err) };
  }
}
