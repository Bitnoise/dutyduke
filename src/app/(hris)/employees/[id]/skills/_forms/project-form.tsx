'use client';

import { useTranslations } from '@/shared/service/locale/use-translations';
import { parseDate, type CUID } from '@/shared';
import { addProject, updateProject } from '@/app/(hris)/employees/[id]/skills/_actions';
import { Checkbox, DateField, Form, FormControl, FormFooter, TextArea, TextInput } from '@/lib/ui';
import { useToast } from '@/lib/ui/hooks';
import { SKILLS_TOASTS } from '@/shared/constants/toast-notifications';
import { type ProjectSchema, type ProjectForm } from '../_schemas';

type Props = {
  project?: ProjectSchema;
  employeeId: CUID;
  onRemove(): void;
  dateFormat: string;
};

export function ProjectForm({ project, employeeId, onRemove, dateFormat }: Props): JSX.Element {
  const t = useTranslations('employees.skillsView');
  const toast = useToast();

  const handleSuccess = () => {
    toast(project ? SKILLS_TOASTS.UPDATE_PROJECT : SKILLS_TOASTS.ADD_PROJECT);
    onRemove();
  };

  return (
    <Form
      focusInputOnError
      action={project ? updateProject : addProject}
      className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2"
      defaultState={{
        status: 'idle',
        form: {
          startDate: project?.startDate ? parseDate(project.startDate, dateFormat) : '',
          endDate: project?.endDate ? parseDate(project.endDate, dateFormat) : '',
          name: project?.name ?? '',
          role: project?.role ?? '',
          description: project?.description ?? '',
          isVisible: project?.isVisible ?? true,
          employeeId,
          projectId: project?.id ?? '',
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
              <TextInput isRequired defaultValue={form.name} label={t('projectName')} {...formState} />
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
          <FormControl errors={errors} name="isVisible">
            {(formState) => (
              <Checkbox defaultSelected={form.isVisible} value="true" {...formState}>
                {t('showInCv')}
              </Checkbox>
            )}
          </FormControl>
          <div />
          <FormFooter onCancel={onRemove} />
        </>
      )}
    </Form>
  );
}
