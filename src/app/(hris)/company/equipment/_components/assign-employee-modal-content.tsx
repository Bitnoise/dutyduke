'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button } from '@/lib/ui';
import { HRIS_ROUTES } from '@/shared';

type Props = {
  equipmentIds: string;
  eqFilter?: string;
  eqCategory?: string;
  eqStatus?: string;
};

export function AssignEmployeeModalContent({ equipmentIds, eqCategory, eqFilter, eqStatus }: Props) {
  const t = useTranslations();
  const router = useRouter();

  return (
    <>
      <p className="py-4">{t('modal.content.assignEquipment')}</p>
      <div className="flex justify-end gap-4">
        <Button icon="close" intent="tertiary" onClick={() => router.back()}>
          {t('ctaLabels.no')}
        </Button>
        <Link href={HRIS_ROUTES.equipment.assign(equipmentIds, eqCategory, eqStatus, eqFilter)}>
          <Button icon="ok">{t('ctaLabels.confirmAssign')}</Button>
        </Link>
      </div>
    </>
  );
}
