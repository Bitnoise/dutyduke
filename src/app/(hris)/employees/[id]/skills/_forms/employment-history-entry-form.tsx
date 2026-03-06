import { useTranslations } from '@/shared/service/locale/use-translations';
import { DateField, Form, FormControl, FormFooter, TextArea, TextInput } from '@/lib/ui';
import { parseDate, type CUID } from '@/shared';
import { useToast } from '@/lib/ui/hooks';
import { SKILLS_TOASTS } from '@/shared/constants/toast-notifications';
import { addEmploymentHistory, updateEmploymentHistory } from '@/app/(hris)/employees/[id]/skills/_actions';
import { type EmploymentHistorySchema } from '../_schemas';

type Props = {
  employmentHistoryEntry?: EmploymentHistorySchema;
  employeeId: CUID;
  onRemove: () => void;
  dateFormat: string;
};

export function EmploymentHistoryEntryForm({
  employmentHistoryEntry,
  employeeId,
  onRemove,
  dateFormat,
}: Props): JSX.Element {
  const t = useTranslations('employees.skillsView');
  const toast = useToast();

  const handleSuccess = () => {
    toast(
      employmentHistoryEntry ? SKILLS_TOASTS.UPDATE_EMPLOYMENT_HISTORY : SKILLS_TOASTS.ADD_EMPLOYMENT_HISTORY,
    );
    onRemove();
  };

  return (
    <Form
      focusInputOnError
      action={employmentHistoryEntry ? updateEmploymentHistory : addEmploymentHistory}
      className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2"
      defaultState={{
        status: 'idle',
        form: {
          startDate: employmentHistoryEntry?.startDate
            ? parseDate(employmentHistoryEntry.startDate, dateFormat)
            : '',
          endDate: employmentHistoryEntry?.endDate
            ? parseDate(employmentHistoryEntry.endDate, dateFormat)
            : '',
          company: employmentHistoryEntry?.company ?? '',
          role: employmentHistoryEntry?.role ?? '',
          description: employmentHistoryEntry?.description ?? '',
          employeeId,
          employmentHistoryId: employmentHistoryEntry?.id ?? '',
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
          <FormControl errors={errors} name="company">
            {(formState) => (
              <TextInput isRequired defaultValue={form.company} label={t('companyName')} {...formState} />
            )}
          </FormControl>
          <FormControl errors={errors} name="role">
            {(formState) => (
              <TextInput isRequired defaultValue={form.role} label={t('role')} {...formState} />
            )}
          </FormControl>
          <div className="col-span-full">
            <FormControl errors={errors} name="description">
              {(formState) => (
                <TextArea defaultValue={form.description} label={t('description')} {...formState} />
              )}
            </FormControl>
          </div>
          <FormFooter onCancel={onRemove} />
        </>
      )}
    </Form>
  );
}
