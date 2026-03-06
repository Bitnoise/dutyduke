'use client';

import { useRouter } from 'next/navigation';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, DownloadCv, Icon } from '@/lib/ui';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { type ActionType, cn } from '@/shared';
import { useModal, useToast } from '@/lib/ui/hooks';
import { archiveEmployees, activateEmployees } from '@/app/(hris)/employees/_actions';
import { DeleteModal } from '@/lib/ui/components/modal';
import { type EmployeeAction } from '@/api/hris/employees/model/dtos';
import { ACTIONS } from '@/shared/constants/table-actions';

type Props = {
  actions: EmployeeAction[];
};

const ALLOWED_ACTIONS: EmployeeAction[] = ['generate-cv', 'archive'];

export function EmployeeBulkActionMenu({ actions }: Props): JSX.Element {
  const t = useTranslations('employeeMenu');
  const tNext = useNextTranslations('employeeMenu');
  const { selectedItems, cleanSelectedItems } = useSelectItems('EMPLOYEES');
  const router = useRouter();
  const { isOpen: isCvModelOpen, openModal: openCvModal, closeModal: closeCvModal } = useModal();
  const {
    isOpen: isArchiveEmployeeModalOpen,
    openModal: openArchiveEmployeeModal,
    closeModal: closeArchiveEmployeeModal,
  } = useModal();
  const toast = useToast();

  const handleArchiveEmployee = async () => {
    await archiveEmployees(selectedItems);
    cleanSelectedItems();
    router.refresh();
    toast({
      intent: 'success',
      label: 'employees.archive.success',
    });
    closeArchiveEmployeeModal();
  };

  const _handleActivateEmployees = async () => {
    await activateEmployees(selectedItems);
    cleanSelectedItems();
    router.refresh();
    toast({
      intent: 'success',
      label: 'employees.activate.success',
    });
  };

  const handleAction = async (action: ActionType) => {
    switch (action) {
      case 'open':
        openCvModal();
        break;
      case 'archive':
        openArchiveEmployeeModal();
        break;
    }
  };

  const allowedActions = actions
    .filter((action) => ALLOWED_ACTIONS.includes(action))
    .map((action) => ACTIONS[action]);

  return (
    <>
      <Menu
        aria-label={tNext('employeeBulkMenu')}
        trigger={
          <Button icon="context" intent="tertiary" size="sm">
            {t('actions')}
          </Button>
        }
      >
        {allowedActions.map((action) => (
          <MenuItem
            key={action.id}
            className={cn('flex items-center gap-x-2.5', {
              'text-warning': action.id === 'archive',
            })}
            textValue={tNext(action.label)}
            onAction={() => handleAction(action.id)}
          >
            <Icon name={action.icon} size="xs" />
            <span>{t(action.label)}</span>
          </MenuItem>
        ))}
      </Menu>
      <DownloadCv employeeIds={selectedItems} isOpen={isCvModelOpen} onClose={closeCvModal} />
      <DeleteModal
        count={selectedItems === 'all' ? 'all' : selectedItems.length}
        isOpen={isArchiveEmployeeModalOpen}
        onClose={closeArchiveEmployeeModal}
        onOk={handleArchiveEmployee}
      />
    </>
  );
}
