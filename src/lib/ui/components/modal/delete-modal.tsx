import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button } from '@/lib/ui/components';
import { Modal } from '@/lib/ui/components/modal/modal';
import { ModalHeader } from '@/lib/ui/components/modal/modal-header';

type Props = {
  count?: 'all' | number;
  isOpen: boolean;
  onClose: () => void;
  onOk: () => void;
};

export function DeleteModal({ count = 1, isOpen, onClose, onOk }: Props): JSX.Element {
  const t = useTranslations();

  const handleOk = async () => {
    await onOk();
    onClose();
  };

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader title={t('modal.header.deleteEntry', { count })} onClose={onClose} />
      <p className="py-4 text-sm">
        {count === 'all' ? t('modal.content.deleteAllEntries') : t('modal.content.deleteEntry', { count })}
      </p>
      <div className="flex items-end justify-end gap-x-4">
        <Button className="w-full md:w-fit" icon="close" intent="tertiary" type="button" onClick={onClose}>
          {t('ctaLabels.cancel')}
        </Button>
        <Button className="w-full md:w-fit" icon="trash" intent="danger" type="button" onClick={handleOk}>
          {t('ctaLabels.confirmDelete')}
        </Button>
      </div>
    </Modal>
  );
}
