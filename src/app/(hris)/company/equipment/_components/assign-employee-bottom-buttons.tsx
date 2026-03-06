'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Form, FormControl } from '@/lib/ui';
import { HRIS_ROUTES } from '@/shared';
import { useToast } from '@/lib/ui/hooks';
import { EQUIPMENT_TOASTS } from '@/shared/constants/toast-notifications';
import { assignEquipment } from '../_actions';

type Props = {
  equipmentIds: string[];
  employeeId?: string;
  category?: string;
  filter?: string;
  status?: string;
};

export function AssignEmployeeBottomButtons({ equipmentIds, employeeId, category, status, filter }: Props) {
  const t = useTranslations('ctaLabels');
  const toast = useToast();
  const router = useRouter();

  const onCancel = () => router.push(HRIS_ROUTES.equipment.base);

  const handleSuccess = () => {
    router.push(HRIS_ROUTES.equipment.base);
    toast(EQUIPMENT_TOASTS.UPDATE);
  };

  const handleError = () => toast(EQUIPMENT_TOASTS.ASSIGN);

  return (
    <Form
      action={assignEquipment}
      defaultState={{
        status: 'idle',
        form: {
          equipmentIds,
          assigneeId: employeeId ?? '',
          filterCategory: category ?? null,
          filter: filter ?? null,
          filterStatus: status ?? null,
        },
      }}
      onError={handleError}
      onSuccess={handleSuccess}
    >
      {(_form, errors) => (
        <div className="flex justify-between">
          <FormControl errors={errors}>
            {({ isSubmitting }) => (
              <Button
                icon="close"
                intent="tertiary"
                isDisabled={isSubmitting}
                type="button"
                onClick={onCancel}
              >
                {t('cancel')}
              </Button>
            )}
          </FormControl>
          <FormControl errors={errors}>
            {({ isSubmitting }) => (
              <Button icon="link-individual" isDisabled={isSubmitting || !employeeId} type="submit">
                {t('assign')}
              </Button>
            )}
          </FormControl>
        </div>
      )}
    </Form>
  );
}
