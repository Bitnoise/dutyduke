import { redirect } from 'next/navigation';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { Modal, ModalHeader } from '@/lib/ui';
import { HRIS_ROUTES } from '@/shared';
import { UnassignEquipmentModalForm } from '../../../_forms';

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    equipment: string;
    filter?: string;
    category?: string;
    status?: string;
  }>;
};

export default async function UnassignEmployee(props: Props) {
  const [{ id }, { equipment, category, filter, status }] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  const t = await getTranslations();

  if (!id) redirect(HRIS_ROUTES.employees.base);
  if (!equipment) redirect(HRIS_ROUTES.employees.equipment.base(id));

  const parsedEquipmentIds = equipment === 'all' ? 'all' : equipment.split(',');
  const count = parsedEquipmentIds.length;

  return (
    <Modal isOpen>
      <ModalHeader title={t('modal.header.unassignEquipment')} />
      <p>{t('modal.content.unassignEquipment', { count })}</p>
      <UnassignEquipmentModalForm
        category={category}
        employeeId={id}
        equipmentIds={parsedEquipmentIds}
        filter={filter}
        status={status}
      />
    </Modal>
  );
}
