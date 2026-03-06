import { redirect } from 'next/navigation';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { Modal, ModalHeader } from '@/lib/ui';
import { HRIS_ROUTES } from '@/shared';
import { UnassignEmployeeForm } from '../../_forms';

type Props = {
  searchParams: Promise<{
    equipment: string | 'all';
    category?: string;
    filter?: string;
    status?: string;
  }>;
};

export default async function UnassignEmployee({ searchParams }: Props) {
  const { equipment, category, filter, status } = await searchParams;
  const t = await getTranslations();

  if (!equipment) redirect(HRIS_ROUTES.equipment.base);

  return (
    <Modal isOpen>
      <ModalHeader title={t('modal.header.unassignEquipment')} />
      <UnassignEmployeeForm category={category} equipmentIds={equipment} filter={filter} status={status} />
    </Modal>
  );
}
