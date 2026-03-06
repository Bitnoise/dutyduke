import { useState } from 'react';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type AbsenceStatus, type AbsenceAction } from '@/api/hris/absences/model/dtos/absence.dto';
import { Button, Icon } from '@/lib/ui';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { cn, type Nullable, type CUID } from '@/shared';
import { ACTIONS } from '@/shared/constants/table-actions';
import { useToast } from '@/lib/ui/hooks';
import { ABSENCE_TOASTS } from '@/shared/constants/toast-notifications';
import { approveAbsence } from '../_actions/approve-absence.action';
import { rejectAbsence } from '../_actions/reject-absence.action';
import { ConfirmationModal } from './confirmation-modal';

type Props = {
  actions: AbsenceAction[];
  absenceId: CUID[] | 'all';
  reviewerId: CUID;
  variant?: 'default' | 'large';
  status?: AbsenceStatus;
  approvedAt?: Nullable<Date>;
  rejectedAt?: Nullable<Date>;
  isBulkAction?: boolean;
};

export const ALLOWED_ACTIONS: AbsenceAction[] = ['approve', 'reject'];

export function AbsencesMenu({
  actions,
  absenceId,
  reviewerId,
  approvedAt,
  rejectedAt,
  status,
  isBulkAction,
  variant = 'default',
}: Props) {
  const t = useTranslations('absences');
  const tNext = useNextTranslations('absences');
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [chosenAction, setChosenAction] = useState<AbsenceAction | undefined>();

  const handleAction = async (action: AbsenceAction) => {
    setChosenAction(action);

    if (action === 'reject') {
      if (status === 'APPROVED' || isBulkAction) {
        setIsOpen(true);
        return;
      }

      await rejectAbsence(absenceId, reviewerId);
      toast(ABSENCE_TOASTS.REJECT);
      return;
    }

    if (action === 'approve') {
      if (status === 'REJECTED' || isBulkAction) {
        setIsOpen(true);
        return;
      }

      await approveAbsence(absenceId, reviewerId);
      toast(ABSENCE_TOASTS.APPROVE);
      return;
    }
  };

  const handleConfirm = async (action: AbsenceAction) => {
    if (action === 'reject') {
      await rejectAbsence(absenceId, reviewerId);
      toast(ABSENCE_TOASTS.REJECT);
    } else if (action === 'approve') {
      await approveAbsence(absenceId, reviewerId);
      toast(ABSENCE_TOASTS.APPROVE);
    }
    setIsOpen(false);
  };

  const allowedActions = actions
    .filter((action) => ALLOWED_ACTIONS.includes(action))
    .filter(
      (action) =>
        (action === 'approve' && status !== 'APPROVED') || (action === 'reject' && status !== 'REJECTED'),
    );

  const statusUpdateDate = approvedAt ?? rejectedAt ?? null;
  const modalText = chosenAction === 'reject' ? 'absenceRejectConfirm' : 'absenceApproveConfirm';
  return (
    <>
      <Menu
        trigger={
          variant === 'large' ? (
            <Button icon="context" intent="tertiary">
              {t('actions')}
            </Button>
          ) : undefined
        }
      >
        {allowedActions.map((action) => {
          const { icon, label } = ACTIONS[action];

          return (
            <MenuItem
              key={action}
              className={cn('flex items-center gap-x-2.5', {
                'text-warning': action === 'reject',
              })}
              id={action}
              textValue={tNext(label)}
              onAction={() => handleAction(action)}
            >
              <Icon name={icon} size="xs" />
              <span>{t(label)}</span>
            </MenuItem>
          );
        })}
      </Menu>
      <ConfirmationModal
        header={
          isBulkAction
            ? chosenAction === 'approve'
              ? 'absenceBulkApproval'
              : 'absenceBulkRejection'
            : modalText
        }
        isBulkAction={isBulkAction}
        isOpen={isOpen}
        status={status ?? (chosenAction === 'approve' ? 'REJECTED' : 'APPROVED')}
        statusUpdateDate={statusUpdateDate}
        text={
          isBulkAction
            ? chosenAction === 'approve'
              ? 'absenceBulkApproval'
              : 'absenceBulkRejection'
            : modalText
        }
        onClose={() => setIsOpen(false)}
        onOk={handleConfirm}
      />
    </>
  );
}
