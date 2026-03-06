'use client';

import { useState } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button } from '@/lib/ui';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { type CUID } from '@/shared';
import { useModal, useToast } from '@/lib/ui/hooks';
import { DeleteModal } from '@/lib/ui/components/modal';
import { EQUIPMENT_DOCUMENTS_TOASTS } from '@/shared/constants/toast-notifications';
import { deleteEquipmentDocuments } from '../_actions/delete-equipment-document.action';
import { UploadEquipmentDocumentForm, UploadEquipmentDocumentModalForm } from '../_forms';

type Props = {
  isDisabled?: boolean;
  isMobile: boolean;
  equipmentId: CUID;
};

export function DocumentsBulkButtons({ isDisabled = false, isMobile = false, equipmentId }: Props) {
  const t = useTranslations('company.equipment.documents');
  const { selectedItems, cleanSelectedItems } = useSelectItems('DOCUMENTS');
  const { isOpen, openModal, closeModal } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  const handleDeleteDocuments = async () => {
    if (isDisabled || isDeleting) return;

    setIsDeleting(true);

    const formData = new FormData();
    formData.set('selectedDocuments', Array.isArray(selectedItems) ? selectedItems.join(',') : 'all');
    await deleteEquipmentDocuments(equipmentId, formData);

    cleanSelectedItems();
    setIsDeleting(false);
    closeModal();
    toast(EQUIPMENT_DOCUMENTS_TOASTS.DELETE);
  };

  if (isDisabled) return null;

  return (
    <>
      <section className="ml-auto flex">
        {!selectedItems.length && isMobile && <UploadEquipmentDocumentForm equipmentId={equipmentId} />}
        {!selectedItems.length && !isMobile && <UploadEquipmentDocumentModalForm equipmentId={equipmentId} />}
        {selectedItems.length > 0 && (
          <Button
            icon="trash"
            iconPlacement="right"
            intent="danger"
            isDisabled={isDeleting}
            onClick={openModal}
          >
            {t('deleteFile')}
          </Button>
        )}
      </section>
      <DeleteModal
        count={selectedItems === 'all' ? 'all' : selectedItems.length}
        isOpen={isOpen}
        onClose={closeModal}
        onOk={handleDeleteDocuments}
      />
    </>
  );
}
