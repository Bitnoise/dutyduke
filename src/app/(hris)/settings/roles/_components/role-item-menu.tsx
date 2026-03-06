'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Icon } from '@/lib/ui';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { DeleteModal } from '@/lib/ui/components/modal';
import { type RoleListItemDto } from '@/api/hris/authorization/infrastructure/controllers/roles.controller';
import { HRIS_ROUTES } from '@/shared';
import { useModal, useToast } from '@/lib/ui/hooks';
import { deleteRoleAction } from '../_actions/role-actions';

type Props = {
  role: RoleListItemDto;
};

export function RoleItemMenu({ role }: Props): JSX.Element {
  const router = useRouter();
  const t = useTranslations('ctaLabels');
  const { isOpen, openModal, closeModal } = useModal();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`${HRIS_ROUTES.settings.roles}/${role.id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append('roleId', role.id);
      await deleteRoleAction({ status: 'idle', form: { roleId: role.id } }, formData);
      toast({ label: 'Role deleted successfully', intent: 'success' });
      closeModal();
      router.refresh();
    } catch (error) {
      console.error('Error deleting role:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Menu icon="context">
        <MenuItem className="flex items-center gap-x-2.5" onAction={handleEdit}>
          <Icon name="edit-2" size="xs" />
          <span>{t('edit')}</span>
        </MenuItem>
        {!role.isSystem && (
          <MenuItem
            className="flex items-center gap-x-2.5 text-warning"
            isDisabled={isDeleting}
            onAction={openModal}
          >
            <Icon name="trash" size="xs" />
            <span>{t('delete')}</span>
          </MenuItem>
        )}
      </Menu>
      {!role.isSystem && <DeleteModal isOpen={isOpen} onClose={closeModal} onOk={handleDelete} />}
    </>
  );
}
