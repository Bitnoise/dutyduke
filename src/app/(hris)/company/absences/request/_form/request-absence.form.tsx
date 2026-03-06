'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { type DateValue } from 'react-aria-components';
import dayjs from 'dayjs';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, ComboBox, ContentBlock, DateField, Form, FormControl, TextArea } from '@/lib/ui';
import { ABSENCE_TOASTS } from '@/shared/constants/toast-notifications';
import { HRIS_ROUTES } from '@/shared';
import { useToast } from '@/lib/ui/hooks';
import { getBusinessDaysDiff } from '@/shared/utils/get-business-days-diff';
import { type Item } from '@/lib/ui/components/combo-box/types';
import { requestAbsence } from '../_actions/request-absence.action';

type Props = {
  employees: Item[];
  dateFormat: string;
};

export function RequestAbsenceForm({ employees, dateFormat }: Props) {
  const t = useTranslations('absences.request');
  const tNext = useNextTranslations('absences.request');
  const router = useRouter();
  const [startDate, setStartDate] = useState<DateValue | null>(null);
  const [endDate, setEndDate] = useState<DateValue | null>(null);
  const toast = useToast();

  const abcenseTypes = useMemo(
    () => [
      { key: 'HOLIDAY', label: tNext('types.holiday') },
      { key: 'SICK', label: tNext('types.sick') },
      { key: 'PERSONAL', label: tNext('types.personal') },
    ],
    [tNext],
  );

  const workingDays = useMemo(() => {
    if (!startDate || !endDate) return 0;

    const start = dayjs(startDate.toString());
    const end = dayjs(endDate.toString());
    if (end.isBefore(start)) return 0;

    const diff = getBusinessDaysDiff(start, end);

    return Math.max(diff, 0.5);
  }, [endDate, startDate]);

  const goBack = () => {
    router.back();
  };

  const handleSuccess = () => {
    toast(ABSENCE_TOASTS.CREATE);
    router.push(HRIS_ROUTES.company.absences.base);
  };

  return (
    <Form
      action={requestAbsence}
      defaultState={{
        status: 'idle',
        form: {
          startDate: '',
          endDate: '',
          type: 'HOLIDAY',
          description: '',
          employeeId: '',
        },
      }}
      onSuccess={handleSuccess}
    >
      {(_form, errors) => (
        <div className="flex flex-col gap-y-6">
          <FormControl errors={errors} name="employeeId">
            {(control) => (
              <ComboBox {...control} items={employees} label={t('employee')} selectionMode="single" />
            )}
          </FormControl>

          <div className="flex flex-col gap-6 md:flex-row md:gap-5">
            <div className="flex basis-full flex-col gap-y-2">
              <FormControl errors={errors} name="startDate">
                {(control) => (
                  <DateField
                    isRequired
                    {...control}
                    dateFormat={dateFormat}
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
                    label={t('dateTo')}
                    onChange={setEndDate}
                  />
                )}
              </FormControl>
            </div>
          </div>
          <FormControl errors={errors} name="type">
            {(control) => (
              <ComboBox
                {...control}
                isRequired
                className="w-full md:w-[calc(50%_-_0.75rem)]"
                defaultSelectedKey="HOLIDAY"
                items={abcenseTypes}
                label={t('type')}
                selectionMode="single"
              />
            )}
          </FormControl>
          <ContentBlock label={t('workingDays')}>
            {workingDays} {t('workingDays')}
          </ContentBlock>
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
