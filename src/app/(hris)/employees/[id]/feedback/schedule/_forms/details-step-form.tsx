'use client';

import { useTranslations } from '@/shared/service/locale/use-translations';
import { type ActionReturnValidationErrorsType, cn, type PropsWithClassName } from '@/shared';
import { Checkbox, DateField, FormControl, TagField, TextArea } from '@/lib/ui';
import { type Item } from '@/lib/ui/components/combo-box/types';
import { type ScheduleFeedbackForm } from '../_schemas';

type Props = {
  form: Pick<ScheduleFeedbackForm, 'date' | 'facilitators' | 'note' | 'isDone'>;
  errors?: ActionReturnValidationErrorsType<ScheduleFeedbackForm>;
  autoFocus?: boolean;
  employees: Item[];
  dateFormat: string;
};

export function DetailsStepForm({
  form,
  errors,
  autoFocus,
  employees,
  dateFormat,
  className,
}: PropsWithClassName<Props>): JSX.Element {
  const t = useTranslations('employees.feedback.schedule');

  const defaultSelectedTags = form.facilitators ? form.facilitators.split(',').filter(Boolean) : [];

  return (
    <section className={cn('flex flex-col gap-y-6', className)}>
      <p className="text-sm text-dark-grey">{t('fillDetails')}</p>
      <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
        <FormControl errors={errors} name="date">
          {(controlState) => (
            <DateField
              isRequired
              autoFocus={autoFocus}
              dateFormat={dateFormat}
              defaultValue={form.date}
              label={t('date')}
              {...controlState}
            />
          )}
        </FormControl>
        <div />
        <div className="col-span-full">
          <FormControl errors={errors} name="facilitators">
            {(controlState) => (
              <TagField
                isRequired
                defaultSelectedTags={defaultSelectedTags}
                items={employees}
                label={t('facilitator')}
                {...controlState}
              />
            )}
          </FormControl>
        </div>
        <div className="col-span-full">
          <FormControl errors={errors} name="note">
            {(controlState) => (
              <TextArea
                defaultValue={form.note}
                inputProps={{ placeholder: String(t('notePlaceholder')), rows: 4 }}
                label={t('note')}
                {...controlState}
              />
            )}
          </FormControl>
        </div>
        <div className="col-span-full">
          <FormControl errors={errors} name="isDone">
            {(controlState) => (
              <Checkbox defaultSelected={form.isDone} {...controlState}>
                {t('feedbackConducted')}
              </Checkbox>
            )}
          </FormControl>
        </div>
      </div>
    </section>
  );
}
