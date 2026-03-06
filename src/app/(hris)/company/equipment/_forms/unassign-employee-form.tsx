'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Form } from '@/lib/ui';
import { EQUIPMENT_TOASTS } from '@/shared/constants/toast-notifications';
import { useToast } from '@/lib/ui/hooks';
import { unassignEquipment } from '../_actions';

type Props = {
  equipmentIds: string | 'all';
  category?: string;
  filter?: string;
  status?: string;
};

export function UnassignEmployeeForm({ equipmentIds, category, filter, status }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const toast = useToast();

  const parsedEquipmentIds = equipmentIds === 'all' ? equipmentIds : equipmentIds.split(',');

  const handleSuccess = () => {
    router.refresh();
    router.back();
    toast(EQUIPMENT_TOASTS.UPDATE);
  };

  return (
    <>
      <p className="py-4">{t('modal.content.unassignEquipment', { count: parsedEquipmentIds.length })}</p>
      <Form
        action={unassignEquipment}
        defaultState={{
          status: 'idle',
          form: {
            equipmentIds: parsedEquipmentIds,
            filterCategory: category ?? null,
            filter: filter ?? null,
            filterStatus: status ?? null,
          },
        }}
        onSuccess={handleSuccess}
      >
        {() => (
          <div className="flex justify-end gap-4">
            <Button icon="close" intent="tertiary" type="button" onClick={() => router.back()}>
              {t('ctaLabels.no')}
            </Button>
            <Button icon="ok" type="submit">
              {t('ctaLabels.confirmUnassign')}
            </Button>
          </div>
        )}
      </Form>
    </>
  );
}
