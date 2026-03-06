'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import {
  type ActionReturnType,
  type ActionReturnValidationErrorsType,
  cookiesExpirationTimeMs,
  handleActionError,
  HRIS_ROUTES,
} from '@/shared';
import { type LoginUserForm, type LoginUserSchema, loginUserSchema } from '@/app/(auth)/sign-in/_schemas';
import { hrisApi } from '@/api/hris';
import { getAuthenticatedRedirectReturnTo } from '@/shared/utils/redirect';

type LoginUserActionState = ActionReturnType<
  LoginUserForm,
  undefined,
  ActionReturnValidationErrorsType<LoginUserSchema>
>;

export async function loginUser(
  state: LoginUserActionState,
  formData: FormData,
): Promise<LoginUserActionState> {
  const form: LoginUserForm = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const authUser = loginUserSchema.safeParse(form);

  if (!authUser.success) {
    return { form, status: 'validation-error', errors: authUser.error.flatten().fieldErrors };
  }

  const returnUrl = await getAuthenticatedRedirectReturnTo();

  try {
    const token = await hrisApi.auth.login(authUser.data.email, authUser.data.password);
    (await cookies()).set({
      name: 'Authorization',
      value: token,
      expires: new Date(Date.now().valueOf() + cookiesExpirationTimeMs),
      path: '/',
    });
  } catch (err) {
    return { ...state, form, ...handleActionError(err) };
  }

  return redirect(returnUrl || HRIS_ROUTES.dashboard);
}
