'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Icon } from '@/lib/ui';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { cn, type CUID, HRIS_ROUTES, API_ROUTES } from '@/shared';
import { type Action } from '@/shared/constants/table-actions';
import { DeleteModal } from '@/lib/ui/components/modal';
import { useModal, useToast } from '@/lib/ui/hooks';
import { EMPLOYEE_DOCUMENTS_TOASTS } from '@/shared/constants/toast-notifications';
import { deleteEmployeeDocument } from '../_actions';

type Props = {
  document: { id: CUID; description: string; expDate: Date | null };
  actions: Action[];
  employeeId: string;
};

export function DocumentItemMenu({ document, actions, employeeId }: Props): JSX.Element {
  const t = useTranslations('documentsMenu');
  const tNext = useNextTranslations('documentsMenu');
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();
  const toast = useToast();

  const deleteDocumentAction = deleteEmployeeDocument.bind(null, employeeId, document.id);

  const handleDeleteDocument = async () => {
    setIsDeleting(true);
    await deleteDocumentAction();
    setIsDeleting(false);
    toast(EMPLOYEE_DOCUMENTS_TOASTS.DELETE);
    closeModal();
  };

  const handleAction = async (action: Action, id: string) => {
    switch (action.id) {
      case 'edit':
        router.push(HRIS_ROUTES.employees.documents.edit(employeeId, id));
        break;
      case 'open':
        window.open(API_ROUTES.documents.open(id));
        break;
      case 'delete':
        openModal();
        break;
    }
  };

  return (
    <>
      <Menu
        aria-label={
          tNext('documentItemMenu', {
            description: document.description,
          }) + ''
        }
        icon="context"
      >
        {actions.map((action) => (
          <MenuItem
            key={action.id}
            className={cn('flex items-center gap-x-2.5', {
              'text-warning': action.id === 'delete',
            })}
            isDisabled={isDeleting}
            textValue={tNext(action.label) + ''}
            onAction={() => handleAction(action, document.id)}
          >
            <Icon name={action.icon} size="xs" />
            <span>{t(action.label)}</span>
          </MenuItem>
        ))}
      </Menu>
      <DeleteModal isOpen={isOpen} onClose={closeModal} onOk={handleDeleteDocument} />
    </>
  );
}
