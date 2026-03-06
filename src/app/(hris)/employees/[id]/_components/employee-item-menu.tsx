'use client';

import { useRouter } from 'next/navigation';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, DownloadCv, Icon } from '@/lib/ui';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { cn, type ActionType } from '@/shared';
import { useModal, useToast } from '@/lib/ui/hooks';
import { archiveEmployee, activateEmployee } from '@/app/(hris)/employees/_actions';
import { DeleteModal } from '@/lib/ui/components/modal';
import { type EmployeeAction, type BaseEmployeeDto } from '@/api/hris/employees/model/dtos';
import { ACTIONS } from '@/shared/constants/table-actions';

type Props = {
  employee: Omit<BaseEmployeeDto, 'avatarId'>;
  actions: EmployeeAction[];
  variant?: 'default' | 'small';
};

const ALLOWED_ACTIONS: EmployeeAction[] = ['mail', 'generate-cv', 'archive'];

export function EmployeeItemMenu({ employee, actions, variant = 'default' }: Props): JSX.Element {
  const t = useTranslations('employeeMenu');
  const tNext = useNextTranslations('employeeMenu');
  const router = useRouter();
  const { isOpen: isCvModelOpen, openModal: openCvModal, closeModal: closeCvModal } = useModal();
  const {
    isOpen: isArchiveEmployeeModalOpen,
    openModal: openArchiveEmployeeModal,
    closeModal: closeArchiveEmployeeModal,
  } = useModal();
  const toast = useToast();

  const handleArchiveEmployee = async () => {
    await archiveEmployee(employee.id);
    router.refresh();
    toast({
      intent: 'success',
      label: 'employees.archive.success',
    });
    closeArchiveEmployeeModal();
  };

  const handleActivateEmployee = async () => {
    await activateEmployee(employee.id);
    router.refresh();
    toast({
      intent: 'success',
      label: 'employees.activate.success',
    });
  };

  const handleAction = async (action: ActionType) => {
    switch (action) {
      case 'generate-cv':
        openCvModal();
        break;
      case 'mail':
        router.push(`mailTo:${employee.workEmail}`);
        break;
      case 'archive':
        openArchiveEmployeeModal();
        break;
    }
  };

  let allowedActions = actions
    .filter((action) => ALLOWED_ACTIONS.includes(action))
    .map((action) => ACTIONS[action]);

  // For archived employees: remove archive option and add activate at the top
  if (employee.status === 'ARCHIVED') {
    allowedActions = allowedActions.filter((action) => action.id !== 'archive');
    allowedActions = [
      {
        id: 'activate',
        label: 'activate',
        icon: 'ok',
      },
      ...allowedActions,
    ];
  }

  return (
    <>
      <Menu
        aria-label={tNext('employeeItemMenu', {
          firstName: employee.firstName,
          lastName: employee.lastName,
        })}
        trigger={
          variant === 'default' ? (
            <>
              <Button className="hidden lg:block" icon="context" intent="tertiary" size="sm">
                {t('options')}
              </Button>
              <Button className="lg:hidden" icon="context" intent="ghost" size="sm" />
            </>
          ) : undefined
        }
      >
        {allowedActions.map((action) => (
          <MenuItem
            key={action.id}
            className={cn('flex items-center gap-x-2.5', {
              'text-warning': action.id === 'archive',
              'text-success': action.id === 'activate',
            })}
            textValue={tNext(action.label || action.id)}
            onAction={() => {
              if (action.id === 'activate') {
                handleActivateEmployee();
              } else {
                handleAction(action.id);
              }
            }}
          >
            <Icon name={action.icon} size="xs" />
            <span>{t(action.label || action.id)}</span>
          </MenuItem>
        ))}
      </Menu>
      <DownloadCv employeeIds={[employee.id]} isOpen={isCvModelOpen} onClose={closeCvModal} />
      <DeleteModal
        isOpen={isArchiveEmployeeModalOpen}
        onClose={closeArchiveEmployeeModal}
        onOk={handleArchiveEmployee}
      />
    </>
  );
}
