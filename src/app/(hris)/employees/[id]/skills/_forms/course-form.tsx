'use client';

import { useTranslations } from '@/shared/service/locale/use-translations';
import { parseDate, type CUID } from '@/shared';
import { addCourse, updateCourse } from '@/app/(hris)/employees/[id]/skills/_actions';
import { DateField, Form, FormControl, FormFooter, TextInput } from '@/lib/ui';
import { useToast } from '@/lib/ui/hooks';
import { SKILLS_TOASTS } from '@/shared/constants/toast-notifications';
import { type CourseSchema } from '../_schemas';

type Props = {
  course?: CourseSchema;
  employeeId: CUID;
  onRemove(): void;
  dateFormat: string;
};

export function CourseForm({ course, employeeId, onRemove, dateFormat }: Props): JSX.Element {
  const t = useTranslations('employees.skillsView');
  const toast = useToast();

  const handleSuccess = () => {
    if (course) {
      toast(SKILLS_TOASTS.UPDATE_COURSE);
    } else {
      toast(SKILLS_TOASTS.ADD_COURSE);
    }
    onRemove();
  };

  return (
    <Form
      focusInputOnError
      action={course ? updateCourse : addCourse}
      className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2"
      defaultState={{
        status: 'idle',
        form: {
          date: course?.date ? parseDate(course.date, dateFormat) : '',
          name: course?.name ?? '',
          employeeId,
          courseId: course?.id ?? '',
        },
      }}
      onSuccess={handleSuccess}
    >
      {(form, errors) => (
        <>
          <FormControl errors={errors} name="date">
            {(formState) => (
              <DateField
                isRequired
                dateFormat={dateFormat}
                defaultValue={form.date}
                label={t('date')}
                {...formState}
              />
            )}
          </FormControl>
          <FormControl errors={errors} name="name">
            {(formState) => (
              <TextInput isRequired defaultValue={form.name} label={t('courseName')} {...formState} />
            )}
          </FormControl>
          <FormFooter onCancel={onRemove} />
        </>
      )}
    </Form>
  );
}
