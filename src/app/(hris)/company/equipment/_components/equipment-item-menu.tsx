'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations as useNextTranslations } from 'next-intl';
import { Button, Icon } from '@/lib/ui';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import {
  type ActionType,
  cn,
  type CUID,
  HRIS_ROUTES,
  type Nullable,
  type PropsWithClassName,
} from '@/shared';
import { type EquipmentAction } from '@/api/hris/resources/model/dtos';
import { ACTIONS } from '@/shared/constants/table-actions';

type Props = {
  equipmentId: CUID;
  variant?: 'small' | 'default';
  actions: EquipmentAction[];
  isAssigned: boolean;
  isEmployeeAction?: boolean;
  employeeId?: string;
};

const MENU_ACTIONS: EquipmentAction[] = ['archive', 'assign', 'changeStatus', 'duplicate'];

export function EquipmentItemMenu({
  equipmentId,
  variant = 'default',
  className,
  actions,
  isAssigned,
  isEmployeeAction,
  employeeId,
}: PropsWithClassName<Props>): Nullable<JSX.Element> {
  const t = useNextTranslations('ctaLabels');
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get('category') ?? undefined;
  const status = searchParams.get('status') ?? undefined;
  const filter = searchParams.get('filter') ?? undefined;

  let allowedActions = actions
    .filter((action) => MENU_ACTIONS.includes(action))
    .map((action) => ACTIONS[action]);

  if (isAssigned) {
    allowedActions = allowedActions.map((action) => (action.id === 'assign' ? ACTIONS.unassign : action));
  }

  if (!allowedActions.length) {
    return null;
  }

  const handleAction = (action: ActionType) => {
    switch (action) {
      case 'assign': {
        return isEmployeeAction && employeeId
          ? router.push(HRIS_ROUTES.employees.equipment.assign(employeeId))
          : router.push(HRIS_ROUTES.equipment.assign(equipmentId, category, status, filter));
      }
      case 'unassign': {
        return isEmployeeAction && employeeId
          ? router.push(
              HRIS_ROUTES.employees.equipment.unassign(employeeId, equipmentId, category, status, filter),
            )
          : router.push(HRIS_ROUTES.equipment.unassignEmployee(equipmentId, category, status, filter));
      }
      case 'changeStatus':
        router.push(HRIS_ROUTES.equipment.update(equipmentId, category, status, filter));
        break;
      case 'duplicate':
        router.push(HRIS_ROUTES.equipment.duplicate(equipmentId));
        break;
      case 'archive':
        router.push(HRIS_ROUTES.equipment.archive(equipmentId, category, status, filter));
        break;
    }
  };

  return (
    <Menu
      trigger={
        variant === 'default' ? (
          <>
            <Button className="hidden lg:block" icon="context" intent="tertiary" size="sm">
              {t('options')}
            </Button>
            <Button className="lg:hidden" icon="context" intent="ghost" size="sm" />
          </>
        ) : undefined
      }
      triggerClassName={cn(className)}
    >
      {allowedActions.map((action) => (
        <MenuItem
          key={action.id}
          className={cn('flex items-center gap-x-2.5', {
            'text-warning': action.id === 'archive',
          })}
          textValue={t(action.label)}
          onAction={() => handleAction(action.id)}
        >
          <Icon name={action.icon} size="xs" />
          <span>{t(action.label)}</span>
        </MenuItem>
      ))}
    </Menu>
  );
}
