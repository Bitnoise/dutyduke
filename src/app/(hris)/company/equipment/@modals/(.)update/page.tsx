import { redirect } from 'next/navigation';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { Modal, ModalHeader } from '@/lib/ui';
import { HRIS_ROUTES } from '@/shared';
import { UpdateEquipmentStatusForm } from '../../_forms/update-equipment-status-form';

type Props = {
  searchParams: Promise<{
    equipment: string;
    category?: string;
    filter?: string;
    status?: string;
  }>;
};

export default async function UpdateStatus({ searchParams }: Props) {
  const { equipment, category, filter, status } = await searchParams;
  const t = await getTranslations();

  if (!equipment) redirect(HRIS_ROUTES.equipment.base);
  const parsedEquipmentIds = equipment === 'all' ? equipment : equipment.split(',');

  return (
    <Modal isOpen>
      <ModalHeader title={t('modal.header.changeStatus')} />
      <p className="pt-4 text-sm">{t('modal.content.changeStatus')}</p>
      <UpdateEquipmentStatusForm
        category={category}
        equipmentIds={parsedEquipmentIds}
        filter={filter}
        status={status}
      />
    </Modal>
  );
}
