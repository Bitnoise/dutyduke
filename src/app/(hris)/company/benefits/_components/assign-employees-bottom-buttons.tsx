'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Form, FormControl } from '@/lib/ui';
import { HRIS_ROUTES } from '@/shared';
import { useToast } from '@/lib/ui/hooks';
import { BENEFIT_TOASTS } from '@/shared/constants/toast-notifications';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { assignBenefits } from '../_actions/assign-benefits.action';

type Props = {
  benefitIds: string[];
};

export function AssignEmployeesBottomButtons({ benefitIds }: Props) {
  const t = useTranslations('ctaLabels');
  const toast = useToast();
  const router = useRouter();
  const { selectedItems } = useSelectItems('EMPLOYEES');

  const onCancel = () => router.push(HRIS_ROUTES.benefits.base);

  const handleSuccess = () => {
    router.push(HRIS_ROUTES.benefits.base);
    toast(BENEFIT_TOASTS.ASSIGN);
  };

  const handleError = () => toast(BENEFIT_TOASTS.ASSIGN);

  const employeeIds = Array.isArray(selectedItems) ? selectedItems : selectedItems ? [selectedItems] : [];
  const hasSelectedEmployees = employeeIds.length > 0;

  return (
    <Form
      action={assignBenefits}
      defaultState={{
        status: 'idle',
        form: {
          benefitIds,
          employeeIds: [],
          startDate: new Date().toISOString().split('T')[0],
        },
      }}
      onError={handleError}
      onSuccess={handleSuccess}
    >
      {(_form, errors) => (
        <>
          {benefitIds.map((id) => (
            <input key={id} name="benefitIds" type="hidden" value={id} />
          ))}
          {employeeIds.map((id) => (
            <input key={id} name="employeeIds" type="hidden" value={id} />
          ))}
          <input name="startDate" type="hidden" value={new Date().toISOString().split('T')[0]} />
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
                <Button
                  icon="link-individual"
                  isDisabled={isSubmitting || !hasSelectedEmployees}
                  type="submit"
                >
                  {t('assign')}
                </Button>
              )}
            </FormControl>
          </div>
        </>
      )}
    </Form>
  );
}
