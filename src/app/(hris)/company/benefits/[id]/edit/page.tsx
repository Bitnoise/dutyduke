import { notFound } from 'next/navigation';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { Card } from '@/lib/ui';
import { BasicHeader } from '@/lib/ui/components/basic-header';
import { hrisApi } from '@/api/hris';
import { type CUID } from '@/shared';
import { EditBenefitForm } from './_form/edit-benefit.form';
import { type EditBenefitSchema } from './_schemas/edit-benefit.schema';

type Props = {
  params: Promise<{
    id: CUID;
  }>;
};

export default async function EditBenefitPage(props: Props) {
  const { id } = await props.params;
  const t = await getTranslations('company.benefits.create');
  const api = hrisApi;

  const benefit = await api.benefits.getBenefitById(id).catch(() => null);

  if (!benefit) {
    notFound();
  }

  const formData: EditBenefitSchema = {
    name: benefit.name,
    note: benefit.note || '',
  };

  return (
    <Card>
      <BasicHeader className="pb-8">{t('editTitle')}</BasicHeader>
      <EditBenefitForm benefitId={id} form={formData} />
    </Card>
  );
}
