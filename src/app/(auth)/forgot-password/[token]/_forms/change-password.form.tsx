'use client';
import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { changePassword } from '@/app/(auth)/forgot-password/[token]/_actions';
import { Button, ErrorLayout, FormControl, FormInfo, PasswordInput } from '@/lib/ui';
import { AUTH_ROUTES } from '@/shared';

type Props = {
  token: string;
};

export function ChangePasswordForm({ token }: Props): JSX.Element {
  const t = useTranslations();
  const tNext = useNextTranslations();
  const [state, changePasswordAction] = useActionState(changePassword, {
    status: 'idle',
    form: { token, password: '', confirmPassword: '' },
  });
  const router = useRouter();
  const [countDown, setCountDown] = useState(5);

  useEffect(() => {
    if (state.status !== 'success') return;

    const countDownInterval = setInterval(() => {
      if (!countDown) {
        clearInterval(countDownInterval);
        return;
      }
      setCountDown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      router.replace(AUTH_ROUTES.signIn);
    }, 5000);

    return () => {
      clearInterval(countDownInterval);
      clearTimeout(timeout);
    };
  }, [countDown, router, state.status]);

  const validationErrors = state.status === 'validation-error' ? state.errors : undefined;

  if (state.status === 'success') {
    return (
      <div className="flex flex-col items-center gap-y-2">
        <FormInfo state={state} text={t('resetPassword.success')} />
        <p className="pb-1.5">{t('resetPassword.info', { countDown })}</p>
        <Button intent="tertiary" onClick={() => router.back()}>
          {t('ctaLabels.goTo', { link: tNext('login.title') })}
        </Button>
      </div>
    );
  }

  if (state.status === 'api-error' || state.status === 'error') {
    return (
      <ErrorLayout
        goBackLink={AUTH_ROUTES.signIn}
        heading={t('errorMessages.resetPassword.somethingWentWrong')}
        message={
          'code' in state && state.code === 404
            ? t('errorMessages.resetPassword.tokenExpired')
            : t('errorMessages.resetPassword.unknown')
        }
      />
    );
  }

  return (
    <form noValidate action={changePasswordAction} className="flex flex-col gap-y-4">
      <FormControl errors={validationErrors} name="password">
        {({ isInvalid, isSubmitting, errorMessage, name }) => (
          <PasswordInput
            aria-label={tNext('forms.newPassword')}
            errorMessage={errorMessage}
            inputProps={{ placeholder: tNext('forms.newPassword') }}
            isInvalid={isInvalid}
            isReadOnly={isSubmitting}
            label={t('forms.newPassword')}
            name={name}
          />
        )}
      </FormControl>
      <FormControl errors={validationErrors} name="confirmPassword">
        {({ isInvalid, isSubmitting, errorMessage, name }) => (
          <PasswordInput
            aria-label={tNext('forms.confirmPassword')}
            errorMessage={errorMessage}
            inputProps={{ placeholder: tNext('forms.confirmPassword') }}
            isInvalid={isInvalid}
            isReadOnly={isSubmitting}
            label={t('forms.confirmPassword')}
            name={name}
          />
        )}
      </FormControl>
      <FormControl>
        {({ isSubmitting }) => (
          <Button isLoading={isSubmitting} type="submit">
            {t('ctaLabels.submit')}
          </Button>
        )}
      </FormControl>
    </form>
  );
}
