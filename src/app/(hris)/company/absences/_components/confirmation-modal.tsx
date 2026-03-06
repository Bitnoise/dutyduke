'use client';

import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Modal, ModalHeader } from '@/lib/ui';
import dayjs from '@/shared/utils/dayjs-plugins';
import { type Nullable } from '@/shared';
import { type AbsenceStatus, type AbsenceAction } from '@/api/hris/absences/model/dtos/absence.dto';

type Props = {
  header: string;
  text: string;
  onOk(action: AbsenceAction): void;
  onClose(): void;
  statusUpdateDate?: Nullable<Date>;
  isOpen: boolean;
  status?: AbsenceStatus;
  isBulkAction?: boolean;
};

export function ConfirmationModal({
  header,
  isOpen,
  isBulkAction,
  text,
  status,
  onOk,
  onClose,
  statusUpdateDate,
}: Props) {
  const t = useTranslations();
  const daysPassed = dayjs().diff(statusUpdateDate, 'day');

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader title={t(`modal.header.${header}`)} onClose={onClose} />
      <p className="py-4 text-sm">
        {t(
          `modal.content.${text}`,
          isBulkAction ? {} : { count: isNaN(daysPassed) || daysPassed < 1 ? 1 : daysPassed },
        )}
      </p>
      <div className="flex w-full justify-end gap-4">
        <Button icon="close" intent="secondary" onClick={onClose}>
          {t('ctaLabels.cancel')}
        </Button>
        <Button
          icon="ok"
          intent={status === 'APPROVED' ? 'danger' : 'primary'}
          onClick={() => status && onOk(status === 'APPROVED' ? 'reject' : 'approve')}
        >
          {t('ctaLabels.confirm')}
        </Button>
      </div>
    </Modal>
  );
}
