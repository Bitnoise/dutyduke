'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Icon } from '@/lib/ui';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { DeleteModal } from '@/lib/ui/components/modal';
import { useModal, useToast } from '@/lib/ui/hooks';
import { type BenefitAction } from '@/api/hris/benefits/model/dtos';
import { cn, type PropsWithClassName, HRIS_ROUTES } from '@/shared';
import { BENEFIT_TOASTS } from '@/shared/constants/toast-notifications';
import { deleteBenefitAction } from '../_actions/delete-benefit.action';
import { getEmployeeCountByBenefitAction } from '../_actions/get-employee-count-by-benefit.action';

type Props = {
  variant?: 'small' | 'default';
  actions: BenefitAction[];
  benefitId: string;
};

export function BenefitsItemMenu({
  variant = 'default',
  actions,
  benefitId,
  className,
}: PropsWithClassName<Props>): JSX.Element | null {
  const t = useTranslations('company.benefits');
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal<number>();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [employeeCount, setEmployeeCount] = useState<number | null>(null);

  if (!actions.length) return null;

  const handleDeleteClick = async () => {
    try {
      const count = await getEmployeeCountByBenefitAction(benefitId);
      setEmployeeCount(count);
      openModal(count);
    } catch (_error) {
      // If we can't get the count, still open the modal with 0
      setEmployeeCount(0);
      openModal(0);
    }
  };

  const handleEditClick = () => {
    router.push(HRIS_ROUTES.benefits.edit(benefitId));
  };

  const handleDeleteBenefit = async () => {
    setIsDeleting(true);
    try {
      await deleteBenefitAction(benefitId);
      toast(BENEFIT_TOASTS.DELETE);
      closeModal();
    } catch (_error) {
      // Error is already logged in the action
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
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
        {actions.includes('edit') && (
          <MenuItem className="flex items-center gap-x-2.5" onAction={handleEditClick}>
            <Icon name="edit-2" size="xs" />
            <span>{t('edit')}</span>
          </MenuItem>
        )}
        {actions.includes('delete') && (
          <MenuItem
            className="flex items-center gap-x-2.5 text-warning"
            isDisabled={isDeleting}
            onAction={handleDeleteClick}
          >
            <Icon name="trash" size="xs" />
            <span>{t('delete')}</span>
          </MenuItem>
        )}
      </Menu>
      <DeleteModal
        count={employeeCount ?? 1}
        isOpen={isOpen}
        onClose={closeModal}
        onOk={handleDeleteBenefit}
      />
    </>
  );
}
