'use client';

import { useRouter } from 'next/navigation';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Icon } from '@/lib/ui';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { cn, type CUID, HRIS_ROUTES, type Nullable, type PropsWithClassName } from '@/shared';
import { type EquipmentAction } from '@/api/hris/resources/model/dtos';

type Props = {
  equipmentId: CUID;
  variant?: 'small' | 'default';
  employeeId: CUID;
  actions: EquipmentAction[];
  filter?: string;
  category?: string;
  status?: string;
};

export function EmployeeEquipmentItemMenu({
  equipmentId,
  variant = 'default',
  className,
  actions,
  employeeId,
  category,
  status,
  filter,
}: PropsWithClassName<Props>): Nullable<JSX.Element> {
  const t = useTranslations('ctaLabels');
  const tNext = useNextTranslations('ctaLabels');
  const router = useRouter();

  if (!actions.length || !actions.includes('assign')) {
    return null;
  }

  const handleAction = () =>
    router.push(HRIS_ROUTES.employees.equipment.unassign(employeeId, equipmentId, category, status, filter));

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
      <MenuItem className="flex items-center gap-x-2.5" textValue={tNext('unassign')} onAction={handleAction}>
        <Icon name="unlink" size="xs" />
        <span>{t('unassign')}</span>
      </MenuItem>
    </Menu>
  );
}
