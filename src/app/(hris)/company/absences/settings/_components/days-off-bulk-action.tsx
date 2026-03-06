'use client';
import Link from 'next/link';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type AbsenceAction } from '@/api/hris/absences/model/dtos/absence.dto';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { Button } from '@/lib/ui';
import { cn, HRIS_ROUTES, type PropsWithClassName } from '@/shared';
import { useToast } from '@/lib/ui/hooks';
import { ABSENCE_TOASTS } from '@/shared/constants/toast-notifications';
import { deleteDayOff } from '../_actions/delete-day-off.action';

type Props = {
  actions: AbsenceAction[];
};

export function DaysOffBulkActions({ actions, className }: PropsWithClassName<Props>) {
  const t = useTranslations('absences.settings');
  const toast = useToast();
  const { selectedItems, cleanSelectedItems } = useSelectItems('ABSENCES');

  if (!actions.length) return null;

  const handleAction = async (action: AbsenceAction) => {
    switch (action) {
      case 'delete':
        await deleteDayOff(selectedItems);
        toast(ABSENCE_TOASTS.DELETE);
        cleanSelectedItems();
        break;
    }
  };

  if (actions.includes('delete') && selectedItems.length) {
    return (
      <div className={cn('ml-auto', className)}>
        <Button icon="trash" intent="danger" onClick={() => handleAction('delete')}>
          {t('delete')}
        </Button>
      </div>
    );
  }

  if (actions.includes('create')) {
    return (
      <div className={cn('ml-auto', className)}>
        <Link href={HRIS_ROUTES.company.absences.settings.add}>
          <Button icon="add">{t('add')}</Button>
        </Link>
      </div>
    );
  }

  return null;
}
