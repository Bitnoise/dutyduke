'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type AbsenceAction } from '@/api/hris/absences/model/dtos/absence.dto';
import { type CUID } from '@/api/hris/types';
import { Button } from '@/lib/ui';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { ACTIONS } from '@/shared/constants/table-actions';
import { cn, HRIS_ROUTES, type PropsWithClassName } from '@/shared';
import { useToast } from '@/lib/ui/hooks/use-toast';
import { ABSENCE_TOASTS } from '@/shared/constants/toast-notifications';
import { approveAbsence } from '../_actions/approve-absence.action';
import { rejectAbsence } from '../_actions/reject-absence.action';
import { ConfirmationModal } from './confirmation-modal';

export const ALLOWED_ACTIONS: AbsenceAction[] = ['approve', 'reject'];

type Props = {
  actions: AbsenceAction[];
  reviewerId: CUID;
};

export function AbsencesBulkActions({ actions, reviewerId, className }: PropsWithClassName<Props>) {
  const t = useTranslations('absences');
  const { selectedItems } = useSelectItems('ABSENCES');
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [chosenAction, setChosenAction] = useState<
    Extract<AbsenceAction, 'approve' | 'reject'> | undefined
  >();

  const handleAction = async (action: AbsenceAction) => {
    if (action === 'reject') {
      setChosenAction(action);
      setIsOpen(true);
      return;
    }
    if (action === 'approve') {
      setChosenAction(action);
      setIsOpen(true);
      return;
    }
  };

  const allowedActions = actions.filter((action) => ALLOWED_ACTIONS.includes(action));

  if (!allowedActions.length) return null;

  if (actions.includes('create') && !selectedItems.length) {
    return (
      <div className={cn(className)}>
        <Link href={HRIS_ROUTES.company.absences.request}>
          <Button icon="add">{t('add')}</Button>
        </Link>
      </div>
    );
  }

  const handleConfirm = async () => {
    switch (chosenAction) {
      case 'reject':
        await rejectAbsence(selectedItems, reviewerId);
        setIsOpen(false);
        toast(ABSENCE_TOASTS.REJECT);
        break;
      case 'approve':
        await approveAbsence(selectedItems, reviewerId);
        setIsOpen(false);
        toast(ABSENCE_TOASTS.APPROVE);
        break;
    }
  };

  return (
    <div className={cn('hidden gap-x-4 xl:flex', className)}>
      {allowedActions.map((action) => {
        const { label, icon } = ACTIONS[action];
        return (
          <Button
            key={action}
            icon={icon}
            intent={action === 'reject' ? 'danger' : 'primary'}
            onClick={() => handleAction(action)}
          >
            {t(label)}
          </Button>
        );
      })}
      <ConfirmationModal
        isBulkAction
        header={chosenAction === 'approve' ? 'absenceBulkApproval' : 'absenceBulkRejection'}
        isOpen={isOpen}
        status={chosenAction === 'approve' ? 'REJECTED' : 'APPROVED'}
        text={chosenAction === 'approve' ? 'absenceBulkApproval' : 'absenceBulkRejection'}
        onClose={() => setIsOpen(false)}
        onOk={handleConfirm}
      />
    </div>
  );
}
