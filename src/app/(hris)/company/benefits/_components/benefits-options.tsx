'use client';

import { BasicHeader } from '@/lib/ui/components/basic-header';
import { useTranslations } from '@/shared/service/locale/use-translations';

export function BenefitsOptions(): JSX.Element {
  const t = useTranslations('company.benefits');

  return (
    <div className="flex items-center justify-between">
      <BasicHeader>{t('title')}</BasicHeader>
    </div>
  );
}
