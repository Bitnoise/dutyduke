'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { changePassword } from '@/app/(auth)/change-password/[employeeId]/_actions';
import { Button, Checkbox, Form, FormControl, PasswordInput, CheckboxGroup } from '@/lib/ui';

type Props = {
  email: string;
};

export function ChangePasswordForm({ email }: Props): JSX.Element {
  const t = useTranslations();
  const tNext = useNextTranslations();
  return (
    <Form
      action={changePassword}
      className="flex flex-col gap-y-4"
      defaultState={{
        status: 'idle',
        form: {
          email,
          password: '',
          confirmPassword: '',
          termsAndServicesAgreement: false,
        },
      }}
    >
      {(form, errors) => (
        <>
          <FormControl errors={errors} name="password">
            {(formState) => (
              <PasswordInput
                defaultValue={form.password}
                inputProps={{
                  placeholder: tNext('forms.password'),
                }}
                label={t('forms.password')}
                {...formState}
              />
            )}
          </FormControl>
          <FormControl errors={errors} name="confirmPassword">
            {(formState) => (
              <PasswordInput
                defaultValue={form.confirmPassword}
                inputProps={{
                  placeholder: tNext('forms.confirmPassword'),
                }}
                label={t('forms.confirmPassword')}
                {...formState}
              />
            )}
          </FormControl>
          <FormControl errors={errors} name="termsAndServicesAgreement">
            {({ name, isInvalid, isSubmitting, errorMessage }) => (
              <CheckboxGroup
                aria-label={t('changePassword.termsAndServicesAgreement') as string}
                errorMessage={errorMessage}
                isInvalid={isInvalid}
                isReadOnly={isSubmitting}
                name={name}
              >
                <Checkbox value="true">
                  <span>{t('changePassword.termsAndServicesAgreement')}</span>
                </Checkbox>
              </CheckboxGroup>
            )}
          </FormControl>
          <FormControl>
            {({ isSubmitting }) => (
              <Button isLoading={isSubmitting} size="lg" type="submit">
                {t('ctaLabels.submit')}
              </Button>
            )}
          </FormControl>
        </>
      )}
    </Form>
  );
}
