import { redirect } from 'next/navigation';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { HRIS_ROUTES } from '@/shared';
import { UnassignEquipmentModalForm } from '../../_forms';

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

export default async function UnassignEquipment(props: Props) {
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
    <section className="flex size-full flex-1 rounded-xl bg-white p-4">
      <div>
        <h1 className="text-lg font-semibold">{t('modal.header.unassignEquipment')}</h1>
        <p className="py-4">{t('modal.content.unassignEquipment', { count })}</p>
        <UnassignEquipmentModalForm
          category={category}
          employeeId={id}
          equipmentIds={parsedEquipmentIds}
          filter={filter}
          status={status}
        />
      </div>
    </section>
  );
}
