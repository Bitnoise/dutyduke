'use client';

import { useTranslations } from '@/shared/service/locale/use-translations';
import { type ActionReturnValidationErrorsType, cn, type PropsWithClassName } from '@/shared';
import { FormControl, Radio, RadioGroup } from '@/lib/ui';
import { type ScheduleFeedbackForm } from '../_schemas';

type Props = {
  form: Pick<ScheduleFeedbackForm, 'type'>;
  errors?: ActionReturnValidationErrorsType<ScheduleFeedbackForm>;
  autoFocus?: boolean;
};

export function CategoryStepForm({
  form,
  errors,
  autoFocus: _autoFocus,
  className,
}: PropsWithClassName<Props>): JSX.Element {
  const t = useTranslations('employees.feedback.schedule');

  return (
    <section className={cn('flex flex-col gap-y-6', className)}>
      <p className="text-sm text-dark-grey">{t('selectType')}</p>
      <FormControl errors={errors} name="type">
        {(controlState) => (
          <RadioGroup isRequired defaultValue={form.type} label={String(t('category'))} {...controlState}>
            <Radio value="buddy">{t('type.buddy')}</Radio>
            <Radio value="terminal">{t('type.terminal')}</Radio>
            <Radio value="other">{t('type.other')}</Radio>
          </RadioGroup>
        )}
      </FormControl>
    </section>
  );
}
