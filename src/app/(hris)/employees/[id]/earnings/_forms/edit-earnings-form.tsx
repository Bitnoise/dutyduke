'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, DateField, Form, FormControl, TextArea, TextInput } from '@/lib/ui';
import { parseDate } from '@/shared';
import { type EmployeeEarningsDto } from '@/api/hris/employees/model/dtos';
import { useToast } from '@/lib/ui/hooks';
import { EARNINGS_TOASTS } from '@/shared/constants/toast-notifications';
import { editEarnings } from '../_actions/edit-earnings.action';

type Props = {
  employeeId: string;
  earning: EmployeeEarningsDto;
  dateFormat: string;
};

export function EditEarningsForm({ employeeId, earning, dateFormat }: Props) {
  const { value, date, description } = earning;
  const pushToast = useToast();
  const router = useRouter();

  const t = useTranslations();
  const tNext = useNextTranslations();

  const goBack = () => router.back();

  const handleSuccess = () => {
    pushToast(EARNINGS_TOASTS.EDIT);
    goBack();
  };

  return (
    <Form
      action={editEarnings}
      className="grid grid-cols-1 gap-5 pt-4 sm:grid-cols-2"
      defaultState={{
        status: 'idle',
        form: { id: earning.id, employeeId, value: '', date: '', description: '' },
      }}
      errorMessage={tNext('errorMessages.employeeEarnings.editFailed')}
      id="EditEarningsForm"
      onSuccess={handleSuccess}
    >
      {(_form, errors) => (
        <>
          <FormControl
            errors={errors}
            name="value"
            translationValues={{ smallestValue: 0.01, biggestValue: 999999999, type: 'number' }}
          >
            {({ name, isSubmitting, isInvalid, errorMessage }) => (
              <TextInput
                autoFocus
                defaultValue={value.toString()}
                errorMessage={errorMessage}
                isInvalid={isInvalid}
                isReadOnly={isSubmitting}
                label={`${t('earnings.amount')} (${t('earnings.netIncome')})`}
                name={name}
              />
            )}
          </FormControl>
          <FormControl errors={errors} name="date">
            {({ name, isSubmitting, errorMessage, isInvalid }) => (
              <DateField
                dateFormat={dateFormat}
                defaultValue={parseDate(date, dateFormat) ?? ''}
                errorMessage={errorMessage}
                isInvalid={isInvalid}
                isReadOnly={isSubmitting}
                label={t('forms.date')}
                name={name}
              />
            )}
          </FormControl>
          <FormControl errors={errors} name="description">
            {({ name, isSubmitting, isInvalid, errorMessage }) => (
              <TextArea
                className="md:col-span-2"
                defaultValue={description}
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
                      form="EditEarningsForm"
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
