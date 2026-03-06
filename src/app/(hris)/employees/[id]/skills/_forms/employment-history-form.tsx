'use client';

import { createId } from '@paralleldrive/cuid2';
import { useState } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import {
  type EmploymentHistoryForm,
  type EmploymentHistorySchema,
} from '@/app/(hris)/employees/[id]/skills/_schemas';
import { Button, Icon, List, Section } from '@/lib/ui';
import { useDynamicEntries, useModal, useToast } from '@/lib/ui/hooks';
import { type WithId, type CUID, parseDate, cn, type PropsWithClassName } from '@/shared';
import { EmploymentHistoryEntryForm } from '@/app/(hris)/employees/[id]/skills/_forms';
import { SKILLS_TOASTS } from '@/shared/constants/toast-notifications';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { deleteEmploymentHistory } from '@/app/(hris)/employees/[id]/skills/_actions';
import { DeleteModal } from '@/lib/ui/components/modal';

type Props = {
  employeeId: CUID;
  employmentHistory: EmploymentHistorySchema[];
  isDisabled?: boolean;
  dateFormat: string;
};

function EmploymentHistoryListItem({
  employmentHistory,
  employeeId,
  dateFormat,
  isDisabled,
}: {
  employmentHistory: EmploymentHistorySchema;
  employeeId: CUID;
  dateFormat: string;
  isDisabled?: boolean;
}) {
  const { id, startDate, endDate, company, role, description } = employmentHistory;

  const t = useTranslations();
  const toast = useToast();
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();

  const deleteEmploymentHistoryAction = deleteEmploymentHistory.bind(null, id, employeeId);

  const handleSuccess = () => {
    toast(SKILLS_TOASTS.UPDATE_EMPLOYMENT_HISTORY);
    setIsEdit(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteEmploymentHistoryAction();
    toast(SKILLS_TOASTS.DELETE_EMPLOYMENT_HISTORY);
    setIsDeleting(false);
  };

  if (isEdit) {
    return (
      <EmploymentHistoryEntryForm
        dateFormat={dateFormat}
        employeeId={employeeId}
        employmentHistoryEntry={employmentHistory}
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
          <h2 className="pt-1 text-sm font-semibold">{company}</h2>
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
        <h3 className="text-xs text-accent">{role}</h3>
        {description && <p className="pt-3 text-xs text-dark-grey">{description}</p>}
      </div>
      <DeleteModal isOpen={isOpen} onClose={closeModal} onOk={handleDelete} />
    </>
  );
}

export function EmploymentHistoryForm({
  employeeId,
  isDisabled,
  employmentHistory,
  dateFormat,
  className,
}: PropsWithClassName<Props>) {
  const [employmentHistoryEntries, addEmploymentHistoryEntry, removeEmploymentHistoryEntry] =
    useDynamicEntries<WithId<EmploymentHistoryForm>>([]);
  const t = useTranslations('employees.skillsView');

  const addNewEmploymentHistoryRecord = () => {
    addEmploymentHistoryEntry({
      id: `temp--${createId()}`,
      startDate: '',
      endDate: '',
      company: '',
      role: '',
      description: '',
    });
  };

  return (
    <div className={cn('w-full', className)}>
      <Section
        className="flex flex-col gap-y-12"
        editLabel={t('addNew')}
        heading={t('employmentHistory')}
        icon="add"
        isEdit={!isDisabled}
        onEdit={addNewEmploymentHistoryRecord}
      >
        <List className="flex flex-col gap-y-12" items={employmentHistoryEntries}>
          {(entry, index) => (
            <EmploymentHistoryEntryForm
              key={entry.id}
              dateFormat={dateFormat}
              employeeId={employeeId}
              onRemove={() => removeEmploymentHistoryEntry(index)}
            />
          )}
        </List>
        <List className="flex flex-col gap-y-12" itemClassName="p-2" items={employmentHistory}>
          {(entry) => (
            <EmploymentHistoryListItem
              key={entry.id}
              dateFormat={dateFormat}
              employeeId={employeeId}
              employmentHistory={entry}
              isDisabled={isDisabled}
            />
          )}
        </List>
        {!employmentHistory.length && !employmentHistoryEntries.length && (
          <p className="flex flex-col items-center justify-center gap-y-2 text-center text-gray-600">
            {t('noEmploymentHistory')}
            {!isDisabled && (
              <Button icon="add" intent="ghost" size="sm" onClick={addNewEmploymentHistoryRecord}>
                {t('addNew')}
              </Button>
            )}
          </p>
        )}
      </Section>
    </div>
  );
}
