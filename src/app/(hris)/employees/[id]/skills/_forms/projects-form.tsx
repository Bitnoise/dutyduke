'use client';

import { createId } from '@paralleldrive/cuid2';
import { useState } from 'react';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import {
  type ProjectSchema,
  type ProjectForm as ProjectFormSchema,
} from '@/app/(hris)/employees/[id]/skills/_schemas';
import { Button, Flag, FormControl, Icon, List, Section } from '@/lib/ui';
import { type WithId, type CUID, parseDate, cn, type PropsWithClassName } from '@/shared';
import { useDynamicEntries, useModal, useToast } from '@/lib/ui/hooks';
import { ProjectForm } from '@/app/(hris)/employees/[id]/skills/_forms/project-form';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { changeProjectOrder, deleteProject } from '@/app/(hris)/employees/[id]/skills/_actions';
import { SKILLS_TOASTS } from '@/shared/constants/toast-notifications';
import { DeleteModal } from '@/lib/ui/components/modal';

type Props = {
  projects: ProjectSchema[];
  employeeId: CUID;
  isDisabled?: boolean;
  dateFormat: string;
};

function ProjectListItem({
  project,
  projectsCount,
  employeeId,
  dateFormat,
  isDisabled,
}: {
  project: ProjectSchema;
  projectsCount: number;
  employeeId: CUID;
  dateFormat: string;
  isDisabled?: boolean;
}) {
  const { startDate, endDate, name, role, isVisible, description } = project;

  const t = useTranslations();
  const tNext = useNextTranslations('employees.skillsView');
  const toast = useToast();
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const changeProjectOrderAction = changeProjectOrder.bind(null, project.id, employeeId);
  const deleteProjectAction = deleteProject.bind(null, project.id, employeeId);

  const handleSuccess = () => {
    setIsEdit(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteProjectAction();
    toast(SKILLS_TOASTS.DELETE_PROJECT);
    setIsDeleting(false);
  };

  if (isEdit) {
    return (
      <ProjectForm
        dateFormat={dateFormat}
        employeeId={employeeId}
        project={project}
        onRemove={handleSuccess}
      />
    );
  }

  return (
    <>
      <div
        className={cn('transition-opacity opacity-100', {
          'opacity-50': isDeleting,
        })}
      >
        <div className="text-text-light-body flex gap-x-2 text-xxs">
          <p>{parseDate(startDate, dateFormat)}</p>
          <span>-</span>
          <p>{endDate ? parseDate(endDate, dateFormat) : t('employees.skillsView.untilNow')}</p>
        </div>
        <div className="flex items-center gap-x-2">
          <h2 className="pt-1 text-sm font-semibold">{name}</h2>
          {!isVisible && <Flag intent="danger">CV</Flag>}
          {!isDisabled && (
            <div className="ml-auto flex gap-x-2">
              <form noValidate action={changeProjectOrderAction}>
                {
                  <FormControl>
                    {({ isSubmitting }) => (
                      <>
                        <Button
                          aria-label={tNext('moveProjectUp')}
                          className="rotate-180"
                          icon="arrow2-down"
                          iconSize="sm"
                          intent="ghost"
                          isDisabled={isSubmitting || isDeleting || project.order <= 1}
                          name="up"
                          title={t('employees.skillsView.moveProjectUp')}
                          type="submit"
                        />
                        <Button
                          aria-label={tNext('moveProjectDown')}
                          icon="arrow2-down"
                          iconSize="sm"
                          intent="ghost"
                          isDisabled={isSubmitting || isDeleting || project.order >= projectsCount}
                          name="down"
                          title={t('employees.skillsView.moveProjectDown')}
                          type="submit"
                        />
                      </>
                    )}
                  </FormControl>
                }
              </form>
              <Menu>
                <MenuItem
                  className="flex items-center gap-x-2 text-accent"
                  isDisabled={isDeleting}
                  onAction={() => setIsEdit(true)}
                >
                  <Icon name="edit-2" size="xs" />
                  <span>{t('ctaLabels.edit')}</span>
                </MenuItem>
                <MenuItem
                  className="flex items-center gap-x-2 text-accent"
                  isDisabled={isDeleting}
                  onAction={openModal}
                >
                  <Icon name="trash" size="xs" />
                  <span>{t('ctaLabels.delete')}</span>
                </MenuItem>
              </Menu>
            </div>
          )}
        </div>
        <h3 className="text-xs text-accent">{role}</h3>
        {description && <p className="pt-3 text-xs text-dark-grey">{description}</p>}
      </div>
      <DeleteModal isOpen={isOpen} onClose={closeModal} onOk={handleDelete} />
    </>
  );
}

export function ProjectsForm({
  projects,
  isDisabled,
  employeeId,
  dateFormat,
  className,
}: PropsWithClassName<Props>): JSX.Element {
  const [projectsEntries, addProjectEntry, removeProjectEntry] = useDynamicEntries<WithId<ProjectFormSchema>>(
    [],
  );
  const t = useTranslations('employees.skillsView');

  const addNewProjectEntry = () => {
    addProjectEntry({
      id: `temp--${createId()}`,
      startDate: '',
      endDate: '',
      name: '',
      role: '',
      description: '',
      isVisible: true,
    });
  };

  return (
    <div className={cn('w-full', className)}>
      <Section
        className="flex flex-col gap-y-12"
        editLabel={t('addNew')}
        heading={t('projects')}
        icon="add"
        isEdit={!isDisabled}
        onEdit={addNewProjectEntry}
      >
        <List className="flex flex-col gap-y-12" items={projectsEntries}>
          {(entry, index) => (
            <ProjectForm
              key={entry.id}
              dateFormat={dateFormat}
              employeeId={employeeId}
              onRemove={() => removeProjectEntry(index)}
            />
          )}
        </List>
        <List className="gap-y-4" itemClassName="p-2" items={projects}>
          {(project) => (
            <ProjectListItem
              dateFormat={dateFormat}
              employeeId={employeeId}
              isDisabled={isDisabled}
              project={project}
              projectsCount={projects.length}
            />
          )}
        </List>
        {!projects.length && !projectsEntries.length && (
          <p className="flex flex-col items-center justify-center gap-y-2 text-center text-gray-600">
            {t('noProjects')}
            {!isDisabled && (
              <Button icon="add" intent="ghost" size="sm" onClick={addNewProjectEntry}>
                {t('addNew')}
              </Button>
            )}
          </p>
        )}
      </Section>
    </div>
  );
}
