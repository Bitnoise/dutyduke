import { redirect } from 'next/navigation';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { HRIS_ROUTES } from '@/shared';
import { UnassignEmployeeForm } from '../_forms';

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
    <section className="w-full">
      <h1 className="text-lg font-semibold">{t('modal.header.unassignEquipment')}</h1>
      <UnassignEmployeeForm category={category} equipmentIds={equipment} filter={filter} status={status} />
    </section>
  );
}
