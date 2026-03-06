'use client';

import { DialogTrigger } from 'react-aria-components';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Modal, ModalHeader } from '@/lib/ui';
import { useModal } from '@/lib/ui/hooks';
import { AddCategoryForm } from '../_form/add-category.form';

export function AddCategoryButton() {
  const { isOpen, openModal, closeModal, setIsOpen } = useModal();
  const t = useTranslations('company.documents.categories.add');

  return (
    <DialogTrigger onOpenChange={setIsOpen}>
      <Button icon="add" onClick={openModal}>
        {t('cta')}
      </Button>
      <Modal isDismissable isOpen={isOpen}>
        <ModalHeader title={t('heading')} onClose={closeModal} />
        <AddCategoryForm onCancel={closeModal} />
      </Modal>
    </DialogTrigger>
  );
}
