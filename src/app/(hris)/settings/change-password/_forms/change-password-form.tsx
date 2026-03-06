'use client';

import { useTranslations } from '@/shared/service/locale/use-translations';
import { type ChangePasswordForm } from '@/app/(hris)/settings/change-password/_schemas';
import { Button, FormControl, Section, Form as FormComponent, PasswordInput } from '@/lib/ui';
import { changePassword } from '@/app/(hris)/settings/change-password/_actions';
import { useToast } from '@/lib/ui/hooks';
import { SETTINGS_TOASTS } from '@/shared/constants/toast-notifications';

export function ChangePasswordForm(): JSX.Element {
  const t = useTranslations('settings.changePasswordView');
  const toast = useToast();

  const handleSuccess = () => {
    toast(SETTINGS_TOASTS.CHANGE_PASSWORD);
  };

  return (
    <Section heading={t('changePassword')}>
      <FormComponent
        action={changePassword}
        className="grid grid-cols-2 gap-y-6"
        defaultState={{
          status: 'idle',
          form: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          },
        }}
        onSuccess={handleSuccess}
      >
        {(form: ChangePasswordForm, errors) => (
          <>
            <FormControl errors={errors} name="oldPassword">
              {(formState) => (
                <PasswordInput
                  inputProps={{ placeholder: String(t('oldPassword')) }}
                  label={t('oldPassword')}
                  {...formState}
                />
              )}
            </FormControl>
            <div />
            <FormControl errors={errors} name="newPassword">
              {(formState) => (
                <PasswordInput
                  inputProps={{ placeholder: String(t('newPassword')) }}
                  label={t('newPassword')}
                  {...formState}
                />
              )}
            </FormControl>
            <div />
            <FormControl errors={errors} name="confirmPassword">
              {(formState) => (
                <PasswordInput
                  inputProps={{ placeholder: String(t('confirmPassword')) }}
                  label={t('confirmPassword')}
                  {...formState}
                />
              )}
            </FormControl>
            <div />
            <div className="flex gap-x-4">
              <FormControl>
                {({ isSubmitting }) => (
                  <Button className="w-fit" icon="ok" isDisabled={isSubmitting} type="submit">
                    {t('save')}
                  </Button>
                )}
              </FormControl>
            </div>
          </>
        )}
      </FormComponent>
    </Section>
  );
}
