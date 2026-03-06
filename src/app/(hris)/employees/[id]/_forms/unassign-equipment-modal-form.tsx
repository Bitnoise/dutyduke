'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Form, FormControl } from '@/lib/ui';
import { type CUID } from '@/shared';
import { useToast } from '@/lib/ui/hooks';
import { EQUIPMENT_TOASTS } from '@/shared/constants/toast-notifications';
import { unassignEquipment } from '../../_actions';

type Props = {
  employeeId: CUID;
  equipmentIds: CUID[] | 'all';
  category?: string;
  filter?: string;
  status?: string;
};

export function UnassignEquipmentModalForm({ employeeId, equipmentIds, category, filter, status }: Props) {
  const router = useRouter();
  const toast = useToast();
  const t = useTranslations();

  const handleSuccess = () => {
    router.back();
    toast(EQUIPMENT_TOASTS.UPDATE);
  };

  return (
    <Form
      action={unassignEquipment}
      className="flex flex-col gap-y-6 pb-4 pt-6"
      defaultState={{
        status: 'idle',
        form: {
          equipmentIds,
          assigneeId: employeeId,
          filterCategory: category ?? '',
          filter: filter ?? '',
          filterStatus: status ?? '',
        },
      }}
      onSuccess={handleSuccess}
    >
      {() => (
        <div className="flex justify-end gap-x-4">
          <FormControl>
            {({ isSubmitting }) => (
              <Button
                icon="close"
                intent="tertiary"
                isDisabled={isSubmitting}
                type="button"
                onClick={router.back}
              >
                {t('ctaLabels.no')}
              </Button>
            )}
          </FormControl>
          <FormControl>
            {({ isSubmitting }) => (
              <Button icon="ok" intent="primary" isLoading={isSubmitting} type="submit">
                {t('ctaLabels.confirmUnassign')}
              </Button>
            )}
          </FormControl>
        </div>
      )}
    </Form>
  );
}
