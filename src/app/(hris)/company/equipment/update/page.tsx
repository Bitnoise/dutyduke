import { redirect } from 'next/navigation';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { HRIS_ROUTES } from '@/shared';
import { UpdateEquipmentStatusForm } from '../_forms/update-equipment-status-form';

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
    <section className="w-full">
      <h1 className="text-lg font-semibold">{t('modal.header.changeStatus')}</h1>
      <p className="pt-4 text-sm">{t('modal.content.changeStatus')}</p>
      <UpdateEquipmentStatusForm
        category={category}
        equipmentIds={parsedEquipmentIds}
        filter={filter}
        status={status}
      />
    </section>
  );
}
