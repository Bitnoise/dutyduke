'use client';

import { useActionState } from 'react';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, FormControl, FormInfo, TextInput } from '@/lib/ui';
import { PasswordInput } from '@/lib/ui/components/password-input';
import { loginUser } from '../_actions';

export function LoginForm() {
  const [state, loginUserAction] = useActionState(loginUser, {
    status: 'idle',
    form: { email: '', password: '' },
  });

  const t = useTranslations();
  const tNext = useNextTranslations();

  const errors = state.status === 'validation-error' ? state.errors : undefined;

  return (
    <form noValidate action={loginUserAction} className="flex flex-col gap-y-4">
      <FormInfo state={state} text={t('errorMessages.signInError')} />
      <FormControl errors={errors} name="email">
        {({ name, isSubmitting, isInvalid, errorMessage }) => (
          <TextInput
            autoComplete="email"
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
      <FormControl errors={errors} name="password">
        {({ name, isSubmitting, isInvalid, errorMessage }) => (
          <PasswordInput
            autoComplete="current-password"
            errorMessage={errorMessage}
            inputProps={{ placeholder: tNext('forms.password') }}
            isInvalid={isInvalid}
            isReadOnly={isSubmitting}
            label={t('forms.password')}
            name={name}
          />
        )}
      </FormControl>
      <FormControl>
        {({ isSubmitting }) => (
          <Button className="mt-4" isLoading={isSubmitting} size="lg" type="submit">
            {t('ctaLabels.signIn')}
          </Button>
        )}
      </FormControl>
    </form>
  );
}
