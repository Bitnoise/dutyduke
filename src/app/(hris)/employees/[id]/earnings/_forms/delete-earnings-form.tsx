'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Form, FormControl } from '@/lib/ui';
import { type CUID } from '@/shared';
import { useToast } from '@/lib/ui/hooks';
import { EARNINGS_TOASTS } from '@/shared/constants/toast-notifications';
import { deleteEarnings } from '../_actions/delete-earnings.actions';

type Props = {
  employeeId: CUID;
  id: CUID;
};

export function DeleteEarningsForm({ employeeId, id }: Props) {
  const router = useRouter();
  const toast = useToast();

  const t = useTranslations();
  const tNext = useNextTranslations();

  const goBack = () => router.back();

  const handleSuccess = () => {
    toast(EARNINGS_TOASTS.DELETE);
    goBack();
  };

  return (
    <Form
      action={deleteEarnings}
      className="grid grid-cols-1 gap-5 pt-4 sm:grid-cols-2"
      defaultState={{ status: 'idle', form: { id, employeeId } }}
      errorMessage={tNext('errorMessages.employeeEarnings.deleteFailed')}
      id="DeleteEarningsForm"
      onSuccess={handleSuccess}
    >
      {(_form, errors) => (
        <FormControl errors={errors}>
          {({ isSubmitting }) => (
            <div className="md:col-span-2">
              <div className="flex items-center justify-end gap-2">
                <div>
                  <Button
                    className="mt-4"
                    icon="close"
                    intent="tertiary"
                    isDisabled={isSubmitting}
                    size="md"
                    type="button"
                    onClick={goBack}
                  >
                    {t('ctaLabels.cancel')}
                  </Button>
                </div>
                <div>
                  <Button
                    className="mt-4"
                    form="DeleteEarningsForm"
                    icon="trash"
                    intent="danger"
                    isLoading={isSubmitting}
                    size="md"
                    type="submit"
                  >
                    {t('ctaLabels.confirmDelete')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </FormControl>
      )}
    </Form>
  );
}
