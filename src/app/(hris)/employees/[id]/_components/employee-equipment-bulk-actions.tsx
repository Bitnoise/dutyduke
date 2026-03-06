'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button } from '@/lib/ui';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { type EquipmentAction } from '@/api/hris/resources/model/dtos';
import { HRIS_ROUTES } from '@/shared';

type Props = {
  employeeId?: string;
  equipmentIds?: string;
  variant?: 'small' | 'default';
  actions: EquipmentAction[];
  status?: string;
  category?: string;
  filter?: string;
};

export function EmployeeEquipmentBulkActions({
  actions,
  variant = 'default',
  employeeId,
  equipmentIds,
  category,
  status,
  filter,
}: Props) {
  const t = useTranslations('employees.equipment');
  const router = useRouter();
  const { selectedItems } = useSelectItems('EQUIPMENT');

  if (variant === 'small' && employeeId) {
    return (
      <div className="flex gap-x-2.5">
        {selectedItems.length > 0 ? (
          <Button
            icon="unlink"
            onClick={() =>
              router.push(
                HRIS_ROUTES.employees.equipment.unassign(employeeId, equipmentIds, category, filter, status),
              )
            }
          />
        ) : (
          actions.includes('assign') && (
            <Button
              icon="link-individual"
              onClick={() => router.push(HRIS_ROUTES.employees.equipment.assign(employeeId))}
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
              onClick={() =>
                router.push(
                  HRIS_ROUTES.employees.equipment.unassign(
                    employeeId,
                    equipmentIds,
                    category,
                    filter,
                    status,
                  ),
                )
              }
            >
              {t('unassign')}
            </Button>
          )
        : actions.includes('assign') &&
          employeeId && (
            <Button
              icon="link-individual"
              onClick={() => router.push(HRIS_ROUTES.employees.equipment.assign(employeeId))}
            >
              {t('assign')}
            </Button>
          )}
    </div>
  );
}
