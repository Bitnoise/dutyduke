import { getTranslations } from '@/shared/service/locale/get-translations';
import { AssignEmployeeModalContent } from '../_components';

type Props = {
  searchParams: Promise<{
    equipment: string;
  }>;
};

export default async function AssignEmployee({ searchParams }: Props) {
  const { equipment } = await searchParams;
  const t = await getTranslations();
  return (
    <section className="w-full">
      <h1 className="text-lg font-semibold">{t('modal.header.assignEquipment')}</h1>
      <AssignEmployeeModalContent equipmentIds={equipment} />
    </section>
  );
}
