'use client';

import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Modal, ModalHeader, DragAndDrop } from '@/lib/ui';
import { useModal } from '@/lib/ui/hooks';
import { uploadEmployeeDocument } from '../_actions';

type Props = {
  employeeId: string;
};

export function UploadEmployeeDocumentModalForm({ employeeId }: Props) {
  const t = useTranslations('employees.documents');

  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button icon="upload" iconPlacement="right" onClick={openModal}>
        {t('addFile')}
      </Button>
      <Modal isOpen={isOpen}>
        <ModalHeader title={t('addFile')} onClose={closeModal} />
        <DragAndDrop
          action={uploadEmployeeDocument}
          defaultState={{ status: 'idle', form: { employeeId, file: '' } }}
          showEmptyState={false}
          onSuccess={closeModal}
        />
      </Modal>
    </>
  );
}
