'use client';
import { createId } from '@paralleldrive/cuid2';
import { useState } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import {
  type EducationForm as EducationFormSchema,
  type EducationSchema,
} from '@/app/(hris)/employees/[id]/skills/_schemas';
import { Button, Icon, List, Section } from '@/lib/ui';
import { useDynamicEntries, useModal, useToast } from '@/lib/ui/hooks';
import { type WithId, type CUID, cn, parseDate } from '@/shared';
import { EducationSegmentForm } from '@/app/(hris)/employees/[id]/skills/_forms/education-segment-form';
import { deleteEducation } from '@/app/(hris)/employees/[id]/skills/_actions';
import { SKILLS_TOASTS } from '@/shared/constants/toast-notifications';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { DeleteModal } from '@/lib/ui/components/modal';

type Props = {
  dateFormat: string;
  education: EducationSchema[];
  employeeId: CUID;
  isDisabled?: boolean;
};

function EducationListItem({
  educationItem,
  employeeId,
  dateFormat,
  isDisabled,
}: {
  educationItem: EducationSchema;
  employeeId: CUID;
  dateFormat: string;
  isDisabled?: boolean;
}) {
  const { id, startDate, endDate, name } = educationItem;

  const t = useTranslations();
  const toast = useToast();
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const deleteProjectAction = deleteEducation.bind(null, id, employeeId);

  const handleSuccess = () => {
    toast(SKILLS_TOASTS.UPDATE_EDUCATION);
    setIsEdit(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteProjectAction();
    toast(SKILLS_TOASTS.DELETE_EDUCATION);
    setIsDeleting(false);
  };

  if (isEdit) {
    return (
      <EducationSegmentForm
        dateFormat={dateFormat}
        educationItem={educationItem}
        employeeId={employeeId}
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
          <p>{endDate ? parseDate(endDate, dateFormat) : t('untilNow')}</p>
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

export function EducationForm({ education, isDisabled, employeeId, dateFormat }: Props): JSX.Element {
  const [educationEntries, addEducationEntry, removeEducationEntry] = useDynamicEntries<
    WithId<EducationFormSchema>
  >([]);
  const t = useTranslations('employees.skillsView');

  const addNewEducationEntry = () => {
    addEducationEntry({
      id: `temp--${createId()}`,
      startDate: '',
      endDate: '',
      name: '',
    });
  };

  return (
    <Section
      className="flex flex-col gap-y-12"
      editLabel={t('addNew')}
      heading={t('education')}
      icon="add"
      isEdit={!isDisabled}
      onEdit={addNewEducationEntry}
    >
      <List className="flex flex-col gap-y-12" items={educationEntries}>
        {(entry, index) => (
          <EducationSegmentForm
            key={entry.id}
            dateFormat={dateFormat}
            employeeId={employeeId}
            onRemove={() => removeEducationEntry(index)}
          />
        )}
      </List>
      <List className="flex flex-col gap-y-12" itemClassName="p-2" items={education}>
        {(entry) => (
          <EducationListItem
            key={entry.id}
            dateFormat={dateFormat}
            educationItem={entry}
            employeeId={employeeId}
            isDisabled={isDisabled}
          />
        )}
      </List>
      {!education.length && !educationEntries.length && (
        <p className="flex flex-col items-center justify-center gap-y-2 text-center text-gray-600">
          {t('noEducation')}
          {!isDisabled && (
            <Button icon="add" intent="ghost" size="sm" onClick={addNewEducationEntry}>
              {t('addNew')}
            </Button>
          )}
        </p>
      )}
    </Section>
  );
}
