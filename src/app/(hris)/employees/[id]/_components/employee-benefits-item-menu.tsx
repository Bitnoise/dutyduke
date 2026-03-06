'use client';

import { useState } from 'react';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Icon } from '@/lib/ui';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { cn, type CUID, type PropsWithClassName } from '@/shared';
import { type BenefitAction } from '@/api/hris/benefits/model/dtos';
import { useToast } from '@/lib/ui/hooks';
import { BENEFIT_TOASTS } from '@/shared/constants/toast-notifications';
import { unassignEmployeeBenefitAction } from '../benefits/_actions/unassign-employee-benefit.action';

type Props = {
  employeeBenefitId: CUID;
  variant?: 'small' | 'default';
  employeeId: CUID;
  actions: BenefitAction[];
};

export function EmployeeBenefitsItemMenu({
  employeeBenefitId,
  variant = 'default',
  className,
  actions,
  employeeId,
}: PropsWithClassName<Props>) {
  const t = useTranslations('ctaLabels');
  const tNext = useNextTranslations('ctaLabels');
  const toast = useToast();
  const [isUnassigning, setIsUnassigning] = useState(false);

  if (!actions.length || !actions.includes('unassign')) {
    return null;
  }

  const handleUnassign = async () => {
    setIsUnassigning(true);
    try {
      await unassignEmployeeBenefitAction(employeeBenefitId, employeeId);
      toast(BENEFIT_TOASTS.UNASSIGN);
    } catch (_error) {
      // Error is already logged in the action
    } finally {
      setIsUnassigning(false);
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
      <MenuItem
        className="flex items-center gap-x-2.5"
        isDisabled={isUnassigning}
        textValue={tNext('unassign')}
        onAction={handleUnassign}
      >
        <Icon name="unlink" size="xs" />
        <span>{t('unassign')}</span>
      </MenuItem>
    </Menu>
  );
}
