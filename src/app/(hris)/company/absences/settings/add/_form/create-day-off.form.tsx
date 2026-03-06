'use client';

import { useRouter } from 'next/navigation';
import { type DateValue } from 'react-aria-components';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, ContentBlock, DateField, Form, FormControl, TextArea } from '@/lib/ui';
import { ABSENCE_TOASTS } from '@/shared/constants/toast-notifications';
import { HRIS_ROUTES } from '@/shared';
import { useToast } from '@/lib/ui/hooks';
import { getBusinessDaysDiff } from '@/shared/utils/get-business-days-diff';
import { createDayOff } from '../_actions/create-day-off.action';

type Props = {
  unavailableDates: string[];
  dateFormat: string;
};

export function CreateDayOffForm({ unavailableDates, dateFormat }: Props): JSX.Element {
  const t = useTranslations('absences.request');
  const router = useRouter();
  const [startDate, setStartDate] = useState<DateValue | null>(null);
  const [endDate, setEndDate] = useState<DateValue | null>(null);
  const toast = useToast();

  const goBack = () => {
    router.back();
  };

  const workingDaysCount = useMemo(() => {
    if (!startDate || !endDate) return 0;

    const start = dayjs(startDate.toString());
    const end = dayjs(endDate.toString());
    if (end.isBefore(start)) return 0;

    const diff = getBusinessDaysDiff(start, end);

    return Math.max(diff, 0.5);
  }, [endDate, startDate]);

  const handleSuccess = () => {
    toast(ABSENCE_TOASTS.ADD);
    router.push(HRIS_ROUTES.company.absences.settings.base);
  };

  const isDateUnavailable = (date: DateValue) => {
    return unavailableDates.includes(dayjs(date.toString()).format('YYYY-MM-DD'));
  };

  return (
    <Form
      action={createDayOff}
      defaultState={{
        status: 'idle',
        form: {
          startDate: '',
          endDate: '',
          description: '',
        },
      }}
      onSuccess={handleSuccess}
    >
      {(_form, errors) => (
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-6 md:flex-row md:gap-5">
            <div className="flex basis-full flex-col gap-y-2">
              <FormControl errors={errors} name="startDate">
                {(control) => (
                  <DateField
                    isRequired
                    {...control}
                    dateFormat={dateFormat}
                    isDateUnavailable={isDateUnavailable}
                    label={t('dateFrom')}
                    onChange={setStartDate}
                  />
                )}
              </FormControl>
            </div>
            <div className="flex basis-full flex-col gap-y-2">
              <FormControl errors={errors} name="endDate">
                {(control) => (
                  <DateField
                    isRequired
                    {...control}
                    dateFormat={dateFormat}
                    isDateUnavailable={isDateUnavailable}
                    label={t('dateTo')}
                    onChange={setEndDate}
                  />
                )}
              </FormControl>
            </div>
          </div>
          <ContentBlock label={t('workingDays')}>{workingDaysCount} working days</ContentBlock>
          <FormControl errors={errors} name="description">
            {(control) => <TextArea {...control} label={t('description')} />}
          </FormControl>
          <div className="flex justify-between pt-8">
            <FormControl>
              {({ isSubmitting }) => (
                <Button
                  icon="close"
                  intent="tertiary"
                  isLoading={isSubmitting}
                  type="button"
                  onClick={goBack}
                >
                  {t('cancel')}
                </Button>
              )}
            </FormControl>
            <FormControl>
              {({ isSubmitting }) => (
                <Button icon="ok" isLoading={isSubmitting} type="submit">
                  {t('add')}
                </Button>
              )}
            </FormControl>
          </div>
        </div>
      )}
    </Form>
  );
}
