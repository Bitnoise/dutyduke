'use client';

import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Modal, ModalHeader, DragAndDrop } from '@/lib/ui';
import { useModal } from '@/lib/ui/hooks';
import { uploadEquipmentDocument } from '../_actions/upload-equipment-document.action';

type Props = {
  equipmentId: string;
};

export function UploadEquipmentDocumentModalForm({ equipmentId }: Props) {
  const t = useTranslations('company.equipment.documents');

  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button icon="upload" iconPlacement="right" onClick={openModal}>
        {t('addFile')}
      </Button>
      <Modal isOpen={isOpen}>
        <ModalHeader title={t('addFile')} onClose={closeModal} />
        <DragAndDrop
          action={uploadEquipmentDocument}
          defaultState={{ status: 'idle', form: { equipmentId, file: '' } }}
          showEmptyState={false}
          onSuccess={closeModal}
        />
      </Modal>
    </>
  );
}
