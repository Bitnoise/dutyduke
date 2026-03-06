'use client';

import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button } from '@/lib/ui';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { type BenefitAction } from '@/api/hris/benefits/model/dtos';
import { type CUID } from '@/shared';

type Props = {
  employeeId?: CUID;
  variant?: 'small' | 'default';
  actions: BenefitAction[];
};

export function EmployeeBenefitsBulkActions({ actions, variant = 'default', employeeId }: Props) {
  const t = useTranslations('employees.benefits');
  const { selectedItems } = useSelectItems('BENEFIT');

  if (variant === 'small' && employeeId) {
    return (
      <div className="flex gap-x-2.5">
        {selectedItems.length > 0 ? (
          <Button
            icon="unlink"
            onClick={() => {
              console.log('Unassign selected benefits:', { selectedItems, employeeId });
            }}
          />
        ) : (
          actions.includes('assign') && (
            <Button
              icon="link-individual"
              onClick={() => {
                console.log('Assign benefit to employee:', { employeeId });
              }}
            />
          )
        )}
      </div>
    );
  }

  return (
    <div className="hidden xl:block">
      {selectedItems.length > 0 && employeeId
        ? actions.includes('assign') && (
            <Button
              icon="unlink"
              onClick={() => {
                console.log('Unassign selected benefits:', { selectedItems, employeeId });
              }}
            >
              {t('unassign')}
            </Button>
          )
        : actions.includes('assign') &&
          employeeId && (
            <Button
              icon="link-individual"
              onClick={() => {
                console.log('Assign benefit to employee:', { employeeId });
              }}
            >
              {t('assign')}
            </Button>
          )}
    </div>
  );
}
