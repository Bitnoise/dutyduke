'use client';

import { createId } from '@paralleldrive/cuid2';
import { useState } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import {
  type ProjectForm as ProjectFormSchema,
  type CourseSchema,
} from '@/app/(hris)/employees/[id]/skills/_schemas';
import { Button, Icon, List, Section } from '@/lib/ui';
import { type WithId, type CUID, parseDate, cn } from '@/shared';
import { useDynamicEntries, useModal, useToast } from '@/lib/ui/hooks';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { deleteCourse } from '@/app/(hris)/employees/[id]/skills/_actions';
import { SKILLS_TOASTS } from '@/shared/constants/toast-notifications';
import { CourseForm } from '@/app/(hris)/employees/[id]/skills/_forms';
import { DeleteModal } from '@/lib/ui/components/modal';

type Props = {
  courses: CourseSchema[];
  employeeId: CUID;
  isDisabled: boolean;
  dateFormat: string;
};

function CourseListItem({
  course,
  employeeId,
  dateFormat,
  isDisabled,
}: {
  course: CourseSchema;
  employeeId: CUID;
  dateFormat: string;
  isDisabled: boolean;
}) {
  const { id, date, name } = course;

  const t = useTranslations();
  const toast = useToast();
  const [isEdit, setIsEdit] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteCourseAction = deleteCourse.bind(null, id, employeeId);

  const handleSuccess = () => {
    setIsEdit(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteCourseAction();
    toast(SKILLS_TOASTS.DELETE_COURSE);
    setIsDeleting(false);
  };

  if (isEdit) {
    return (
      <CourseForm course={course} dateFormat={dateFormat} employeeId={employeeId} onRemove={handleSuccess} />
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
          <p>{parseDate(date, dateFormat)}</p>
        </div>
        <div className="flex items-center gap-x-2">
          <h2 className="pt-1 text-sm font-semibold">{name}</h2>
          {!isDisabled && (
            <div className="ml-auto flex gap-x-2">
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
      </div>
      <DeleteModal isOpen={isOpen} onClose={closeModal} onOk={handleDelete} />
    </>
  );
}

export function CoursesForm({ courses, isDisabled, employeeId, dateFormat }: Props): JSX.Element {
  const [courseEntries, addCourseEntry, removeCourseEntry] = useDynamicEntries<WithId<ProjectFormSchema>>([]);
  const t = useTranslations('employees.skillsView');

  const addNewCourse = () => {
    addCourseEntry({
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
    <Section
      className="flex flex-col gap-y-12"
      editLabel={t('addNew')}
      heading={t('courses')}
      icon="add"
      isEdit={!isDisabled}
      onEdit={addNewCourse}
    >
      <List className="flex flex-col gap-y-12" items={courseEntries}>
        {(entry, index) => (
          <CourseForm
            key={entry.id}
            dateFormat={dateFormat}
            employeeId={employeeId}
            onRemove={() => removeCourseEntry(index)}
          />
        )}
      </List>
      <List className="gap-y-4" itemClassName="p-2" items={courses}>
        {(course) => (
          <CourseListItem
            course={course}
            dateFormat={dateFormat}
            employeeId={employeeId}
            isDisabled={isDisabled}
          />
        )}
      </List>
      {!courses.length && !courseEntries.length && (
        <p className="flex flex-col items-center justify-center gap-y-2 text-center text-gray-600">
          {t('noCourses')}
          {!isDisabled && (
            <Button icon="add" intent="ghost" size="sm" onClick={addNewCourse}>
              {t('addNew')}
            </Button>
          )}
        </p>
      )}
    </Section>
  );
}
