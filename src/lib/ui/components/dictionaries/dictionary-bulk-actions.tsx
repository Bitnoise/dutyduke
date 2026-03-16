'use client';

import { useState } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Icon, Modal, ModalHeader } from '@/lib/ui';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { useModal, useToast } from '@/lib/ui/hooks';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { DeleteModal } from '@/lib/ui/components/modal';
import { type Nullable } from '@/shared';
import { type CreateDictionaryEntityActionState } from '@/shared/types/dictionary';
import { DICTIONARY_TOASTS } from '@/shared/constants/toast-notifications';
import { CreateDictionaryForm } from './_forms';

type Props = {
  dictionaryName: string;
  variant?: 'small' | 'default';
  actions: string[];
  onCreateEntity: (
    prevState: CreateDictionaryEntityActionState,
    formData: FormData,
    dictionaryName: string,
  ) => Promise<CreateDictionaryEntityActionState>;
  onDeleteEntities: (ids: string[]) => Promise<void>;
};

export function DictionaryBulkActions({
  dictionaryName,
  variant = 'default',
  actions,
  onCreateEntity,
  onDeleteEntities,
}: Props): Nullable<JSX.Element> {
  const t = useTranslations('dictionaries.' + dictionaryName);
  const { selectedItems, cleanSelectedItems } = useSelectItems('DICTIONARY');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const toast = useToast();

  if (!actions.length) return null;

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleDeleteEntities = async () => {
    if (selectedItems === 'all') return;
    await onDeleteEntities(selectedItems);
    cleanSelectedItems();
    toast(DICTIONARY_TOASTS.DELETE);
  };

  if (variant === 'small') {
    return (
      <>
        <div className="flex gap-x-2.5">
          {selectedItems.length > 0 ? (
            <>
              <Menu
                trigger={
                  <Button icon="context" intent="tertiary" size="sm">
                    {t('actions')}
                  </Button>
                }
              >
                {actions.includes('delete') && (
                  <MenuItem className="flex items-center gap-x-2.5 text-warning" onAction={openDeleteModal}>
                    <Icon name="trash" size="xs" />
                    <span>{t('delete')}</span>
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            <>{actions.includes('create') && <Button icon="add" onClick={handleCreate} />}</>
          )}
        </div>

        <Modal isOpen={isCreateModalOpen}>
          <ModalHeader title={t('createNew')} onClose={handleCloseModal} />
          <CreateDictionaryForm
            action={onCreateEntity}
            dictionaryName={dictionaryName}
            onClose={handleCloseModal}
          />
        </Modal>

        <DeleteModal
          count={selectedItems === 'all' ? 'all' : selectedItems.length}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onOk={handleDeleteEntities}
        />
      </>
    );
  }

  return (
    <>
      <div className="hidden gap-x-4 xl:flex">
        {selectedItems.length > 0 ? (
          <>
            {actions.includes('delete') && (
              <Button icon="trash" iconPlacement="right" intent="danger" onClick={openDeleteModal}>
                {t('archive')}
              </Button>
            )}
          </>
        ) : (
          <>
            {actions.includes('create') && (
              <Button icon="add" iconPlacement="right" onClick={handleCreate}>
                {t('addNew')}
              </Button>
            )}
          </>
        )}
      </div>

      <Modal isOpen={isCreateModalOpen}>
        <ModalHeader title={t('createNew')} onClose={handleCloseModal} />
        <CreateDictionaryForm
          action={onCreateEntity}
          dictionaryName={dictionaryName}
          onClose={handleCloseModal}
        />
      </Modal>

      <DeleteModal
        count={selectedItems === 'all' ? 'all' : selectedItems.length}
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onOk={handleDeleteEntities}
      />
    </>
  );
}
