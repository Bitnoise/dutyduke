import { redirect } from 'next/navigation';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { Modal, ModalHeader } from '@/lib/ui';
import { HRIS_ROUTES } from '@/shared';
import { ArchiveEquipmentForm } from '../../_forms';

type Props = {
  searchParams: Promise<{
    equipment: string;
    category?: string;
    filter?: string;
    status?: string;
  }>;
};

export default async function ArchiveEquipment({ searchParams }: Props) {
  const { equipment, category, filter, status } = await searchParams;
  const t = await getTranslations();

  if (!equipment) redirect(HRIS_ROUTES.equipment.base);
  const parsedEquipmentIds = equipment === 'all' ? equipment : equipment.split(',');
  const count = parsedEquipmentIds.length;

  return (
    <Modal isOpen>
      <ModalHeader title={t('modal.header.archiveEquipment')} titleClassName="text-warning" />
      <p className="pt-4 text-sm">{t('modal.content.archiveEquipment', { count })}</p>
      <ArchiveEquipmentForm
        category={category}
        equipmentIds={parsedEquipmentIds}
        filter={filter}
        status={status}
      />
    </Modal>
  );
}
