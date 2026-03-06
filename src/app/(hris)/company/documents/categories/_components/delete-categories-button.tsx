'use client';

import { DialogTrigger } from 'react-aria-components';
import { useState } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Modal, ModalHeader } from '@/lib/ui';
import { useModal, useQueryParams } from '@/lib/ui/hooks';
import { Stack } from '@/lib/ui/components/stack';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { SEARCH_PARAM_KEYS } from '@/shared';
import { deleteCategories } from '../_actions/delete-categories.action';

export function DeleteCategoryButton() {
  const { isOpen, openModal, closeModal, setIsOpen } = useModal();
  const { selectedItems } = useSelectItems('DICTIONARY');
  const { setSearchParams } = useQueryParams();
  const t = useTranslations('company.documents.categories.delete');
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteCategories(selectedItems);
    setIsLoading(false);
    setSearchParams(SEARCH_PARAM_KEYS.DICTIONARY, '');
    closeModal();
  };

  return (
    <DialogTrigger onOpenChange={setIsOpen}>
      <Button icon="trash" intent="danger" onClick={openModal}>
        {t('cta')}
      </Button>
      <Modal isDismissable isOpen={isOpen}>
        <ModalHeader isDisabled={isLoading} title={t('heading')} onClose={closeModal} />
        <p className="pb-6 pt-2 text-sm">{t('description')}</p>
        <Stack className="justify-end" gapX="1.25rem">
          <Button icon="close" intent="tertiary" isDisabled={isLoading} onClick={closeModal}>
            {t('cancel')}
          </Button>
          <Button icon="trash" intent="danger" isLoading={isLoading} onClick={handleDelete}>
            {t('save')}
          </Button>
        </Stack>
      </Modal>
    </DialogTrigger>
  );
}
