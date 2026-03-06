import { redirect } from 'next/navigation';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { Modal, ModalHeader } from '@/lib/ui';
import { HRIS_ROUTES } from '@/shared';
import { AssignEmployeeModalContent } from '../../_components';

type Props = {
  searchParams: Promise<{
    equipment: string;
    eqFilter?: string;
    eqCategory?: string;
    eqStatus?: string;
  }>;
};

export default async function AssignEmployee({ searchParams }: Props) {
  const { equipment, eqCategory, eqFilter, eqStatus } = await searchParams;
  const t = await getTranslations();

  if (!equipment) redirect(HRIS_ROUTES.equipment.base);

  return (
    <Modal isOpen>
      <ModalHeader title={t('modal.header.assignEquipment')} />
      <AssignEmployeeModalContent
        eqCategory={eqCategory}
        eqFilter={eqFilter}
        eqStatus={eqStatus}
        equipmentIds={equipment}
      />
    </Modal>
  );
}
