'use client';

import { useTranslations } from '@/shared/service/locale/use-translations';
import { parseDate, type CUID } from '@/shared';
import { addEducation, updateEducation } from '@/app/(hris)/employees/[id]/skills/_actions';
import { DateField, Form, FormControl, FormFooter, TextInput } from '@/lib/ui';
import { useToast } from '@/lib/ui/hooks';
import { SKILLS_TOASTS } from '@/shared/constants/toast-notifications';
import { type EducationSchema } from '../_schemas';

type Props = {
  educationItem?: EducationSchema;
  employeeId: CUID;
  onRemove(): void;
  dateFormat: string;
};

export function EducationSegmentForm({
  educationItem,
  employeeId,
  onRemove,
  dateFormat,
}: Props): JSX.Element {
  const t = useTranslations('employees.skillsView');
  const toast = useToast();

  const handleSuccess = () => {
    toast(educationItem ? SKILLS_TOASTS.UPDATE_EDUCATION : SKILLS_TOASTS.ADD_EDUCATION);
    onRemove();
  };

  return (
    <Form
      focusInputOnError
      action={educationItem ? updateEducation : addEducation}
      className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2"
      defaultState={{
        status: 'idle',
        form: {
          startDate: educationItem?.startDate ? parseDate(educationItem.startDate, dateFormat) : '',
          endDate: educationItem?.endDate ? parseDate(educationItem.endDate, dateFormat) : '',
          name: educationItem?.name ?? '',
          employeeId,
          educationId: educationItem?.id ?? '',
        },
      }}
      onSuccess={handleSuccess}
    >
      {(form, errors) => (
        <>
          <FormControl errors={errors} name="startDate">
            {(formState) => (
              <DateField
                isRequired
                dateFormat={dateFormat}
                defaultValue={form.startDate}
                label={t('startDate')}
                {...formState}
              />
            )}
          </FormControl>
          <FormControl errors={errors} name="endDate">
            {(formState) => (
              <DateField
                dateFormat={dateFormat}
                defaultValue={form.endDate}
                label={t('endDate')}
                {...formState}
              />
            )}
          </FormControl>
          <FormControl errors={errors} name="name">
            {(formState) => (
              <TextInput isRequired defaultValue={form.name} label={t('educationName')} {...formState} />
            )}
          </FormControl>
          <div />
          <FormFooter onCancel={onRemove} />
        </>
      )}
    </Form>
  );
}
