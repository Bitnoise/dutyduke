import { getTranslations } from '@/shared/service/locale/get-translations';
import { Card } from '@/lib/ui';
import { BasicHeader } from '@/lib/ui/components/basic-header';
import { CreateBenefitForm } from './_form/create-benefit.form';

export default async function CreateBenefitPage() {
  const t = await getTranslations('company.benefits.create');

  return (
    <Card>
      <BasicHeader className="pb-8">{t('title')}</BasicHeader>
      <CreateBenefitForm />
    </Card>
  );
}
