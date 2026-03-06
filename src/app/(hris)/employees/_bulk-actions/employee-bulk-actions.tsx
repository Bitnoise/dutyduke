'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, DownloadCv } from '@/lib/ui';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { cn, HRIS_ROUTES, type ActionType, type PropsWithClassName } from '@/shared';
import { useModal, useToast } from '@/lib/ui/hooks';
import { archiveEmployees, activateEmployees } from '@/app/(hris)/employees/_actions';
import { DeleteModal } from '@/lib/ui/components/modal';
import { type EmployeeAction } from '@/api/hris/employees/model/dtos';
import { ACTIONS } from '@/shared/constants/table-actions';

type Props = {
  actions: EmployeeAction[];
};

const ALLOWED_ACTIONS: EmployeeAction[] = ['generate-cv', 'archive'];

export function EmployeeBulkActions({ actions, className }: PropsWithClassName<Props>) {
  const t = useTranslations('employeeMenu');
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

  const showHideClassNames = cn('hidden', {
    block: selectedItems.length > 0,
  });

  const handleAction = async (action: ActionType) => {
    switch (action) {
      case 'generate-cv':
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
      <div className={cn('gap-4', className)}>
        {actions.includes('create') && (
          <Button
            className={cn('hidden', {
              block: selectedItems.length < 1,
            })}
            icon="add"
            iconPlacement="right"
            onClick={() => router.push(HRIS_ROUTES.employees.create)}
          >
            {t('createEmployee')}
          </Button>
        )}
        {allowedActions.map((action) => (
          <Button
            key={action.id}
            className={showHideClassNames}
            icon={action.icon}
            intent={action.id === 'archive' ? 'danger' : 'primary'}
            onClick={() => handleAction(action.id)}
          >
            {t(action.label)}
          </Button>
        ))}
      </div>
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
