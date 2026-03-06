'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, DateField, Form, FormControl, TextArea, TextInput } from '@/lib/ui';
import { useToast } from '@/lib/ui/hooks';
import { EARNINGS_TOASTS } from '@/shared/constants/toast-notifications';
import { parseDate } from '@/shared';
import { updateEarnings } from '../_actions/update-earnings.action';

type Props = {
  employeeId: string;
  dateFormat: string;
};

export function UpdateEarningsForm({ employeeId, dateFormat }: Props) {
  const router = useRouter();
  const toast = useToast();
  const t = useTranslations();
  const tNext = useNextTranslations();

  const goBack = () => router.back();

  const handleSuccess = () => {
    toast(EARNINGS_TOASTS.UPDATE);
    goBack();
  };

  return (
    <Form
      action={updateEarnings}
      className="flex flex-col gap-5 pt-4"
      defaultState={{
        status: 'idle',
        form: { employeeId, value: '', date: parseDate(new Date(), dateFormat), description: '' },
      }}
      errorMessage={tNext('errorMessages.employeeEarnings.updateFailed')}
      id="UpdateEarningsForm"
      onSuccess={handleSuccess}
    >
      {(form, errors) => (
        <>
          <div className="flex gap-5">
            <FormControl
              errors={errors}
              name="value"
              translationValues={{ smallestValue: 0.01, biggestValue: 999999999, type: 'number' }}
            >
              {({ name, isSubmitting, isInvalid, errorMessage }) => (
                <TextInput
                  autoFocus
                  className="basis-1/2"
                  defaultValue={form.value.toString()}
                  errorMessage={errorMessage}
                  isInvalid={isInvalid}
                  isReadOnly={isSubmitting}
                  label={`${t('earnings.amount')} (${t('earnings.netIncome')})`}
                  name={name}
                />
              )}
            </FormControl>
            <FormControl errors={errors} name="date">
              {({ name, isSubmitting, isInvalid, errorMessage }) => (
                <DateField
                  className="basis-1/2"
                  dateFormat={dateFormat}
                  defaultValue={form.date}
                  errorMessage={errorMessage}
                  isInvalid={isInvalid}
                  isReadOnly={isSubmitting}
                  label={t('forms.date')}
                  name={name}
                />
              )}
            </FormControl>
          </div>
          <FormControl errors={errors} name="description">
            {({ name, isSubmitting, isInvalid, errorMessage }) => (
              <TextArea
                className="md:col-span-2"
                defaultValue={form.description}
                errorMessage={errorMessage}
                isInvalid={isInvalid}
                isReadOnly={isSubmitting}
                label={t('forms.note')}
                name={name}
              />
            )}
          </FormControl>
          <FormControl errors={errors}>
            {({ isSubmitting }) => (
              <div className="md:col-span-2">
                <div className="flex items-center justify-end gap-2">
                  <div>
                    <Button
                      className="mt-4"
                      icon="close"
                      intent="tertiary"
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
                      form="UpdateEarningsForm"
                      icon="ok"
                      isLoading={isSubmitting}
                      size="md"
                      type="submit"
                    >
                      {t('ctaLabels.save')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </FormControl>
        </>
      )}
    </Form>
  );
}
