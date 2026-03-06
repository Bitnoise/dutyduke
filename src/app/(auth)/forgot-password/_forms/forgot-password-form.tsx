'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, FormControl, FormInfo, TextInput } from '@/lib/ui';
import { forgotPassword } from '../_actions';

export function ForgotPasswordForm() {
  const [state, loginUserAction] = useActionState(forgotPassword, {
    status: 'idle',
    form: { email: '' },
  });
  const router = useRouter();

  const t = useTranslations();
  const tNext = useNextTranslations();

  const errors = state.status === 'validation-error' ? state.errors : undefined;

  if (state.status === 'success') {
    return <FormInfo state={state} text={t('forgotPassword.success', { email: state.data.email })} />;
  }

  return (
    <>
      <div className="pb-4">
        <p>{t('forgotPassword.info')}</p>
      </div>
      <form noValidate action={loginUserAction} className="flex flex-col gap-y-4">
        <FormInfo state={state} text={t('forgotPassword.error')} />
        <FormControl errors={errors} name="email">
          {({ name, isSubmitting, isInvalid, errorMessage }) => (
            <TextInput
              errorMessage={errorMessage}
              inputProps={{ placeholder: tNext('forms.email') }}
              isInvalid={isInvalid}
              isReadOnly={isSubmitting}
              label={t('forms.email')}
              name={name}
              type="email"
            />
          )}
        </FormControl>
        <FormControl>
          {({ isSubmitting }) => (
            <div className="flex justify-end gap-2">
              <div>
                <Button
                  className="flex"
                  icon="arrow-left"
                  intent="ghost"
                  isDisabled={isSubmitting}
                  size="lg"
                  onClick={() => router.back()}
                >
                  {t('ctaLabels.goBack')}
                </Button>
              </div>
              <div>
                <Button isLoading={isSubmitting} size="lg" type="submit">
                  {t('ctaLabels.submit')}
                </Button>
              </div>
            </div>
          )}
        </FormControl>
      </form>
    </>
  );
}
