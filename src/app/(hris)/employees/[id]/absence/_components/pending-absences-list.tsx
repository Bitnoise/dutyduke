'use client';
import { useRouter } from 'next/navigation';
import { ABSENCE_TOASTS } from '@/shared/constants/toast-notifications';
import { type CUID } from '@/shared/types';
import { cn, parseDate } from '@/shared/utils';
import { type AbsenceAction, type AbsenceDTO } from '@/api/hris/absences/model/dtos/absence.dto';
import { type BaseEmployeeDto } from '@/api/hris/employees/model/dtos';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Section } from '@/lib/ui';
import { useToast } from '@/lib/ui/hooks';
import { approveAbsence } from '../../../../company/absences/_actions/approve-absence.action';
import { rejectAbsence } from '../../../../company/absences/_actions/reject-absence.action';

type AbsenceItem = {
  dateRange: string;
  issuer: BaseEmployeeDto | null;
} & Pick<AbsenceDTO, 'approvedAt' | 'id' | 'rejectedAt' | 'requestedAt' | 'status' | 'type' | 'description'>;

type Props = {
  absences: AbsenceItem[];
  actions: AbsenceAction[];
  dateFormat: string;
  reviewerId: CUID;
};

export function PendingAbsencesList({ absences, actions, dateFormat, reviewerId }: Props) {
  const t = useTranslations('absences');
  const toast = useToast();
  const router = useRouter();

  if (absences.length === 0) {
    return null;
  }

  const canApprove = actions.includes('approve');
  const canReject = actions.includes('reject');

  const handleApprove = async (absenceId: string) => {
    await approveAbsence([absenceId], reviewerId);
    toast(ABSENCE_TOASTS.APPROVE);
    router.refresh();
  };

  const handleReject = async (absenceId: string) => {
    await rejectAbsence([absenceId], reviewerId);
    toast(ABSENCE_TOASTS.REJECT);
    router.refresh();
  };

  return (
    <Section heading={t('pendingRequests')}>
      <div className="flex flex-col">
        {absences.map((absence, index) => (
          <div
            key={absence.id}
            className={cn('flex items-center gap-x-6 border-b border-divider py-3 text-sm', {
              'border-b-0': index === absences.length - 1,
            })}
          >
            <div className="flex shrink-0 flex-col">
              <span>{parseDate(absence.requestedAt, dateFormat)}</span>
              <span className="text-xxs text-orange-800">{t(`status.${absence.status.toLowerCase()}`)}</span>
              {absence.description && (
                <span className="mt-1 line-clamp-2 max-w-[120px] text-xxs text-gray-600">
                  {absence.description}
                </span>
              )}
            </div>
            <div className="flex min-w-0 flex-col">
              <span>{absence.issuer ? `${absence.issuer.lastName} ${absence.issuer.firstName}` : '—'}</span>
              <span className="flex gap-x-2.5 text-xxs font-semibold text-gray-600">
                <span
                  className={cn('shrink-0', {
                    'text-blue-800': absence.type === 'PERSONAL',
                    'text-green-800': absence.type === 'HOLIDAY',
                    'text-orange-800': absence.type === 'SICK',
                  })}
                >
                  {t(`type.${absence.type.toLowerCase()}`)}
                </span>
                <span className="block min-w-0 truncate">{absence.dateRange}</span>
              </span>
            </div>
            <div className="ml-auto flex gap-x-2">
              {canApprove && (
                <Button intent="primary" size="sm" onClick={() => handleApprove(absence.id)}>
                  {t('approve')}
                </Button>
              )}
              {canReject && (
                <Button intent="danger" size="sm" onClick={() => handleReject(absence.id)}>
                  {t('reject')}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
