import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type AbsenceAction } from '@/api/hris/absences/model/dtos/absence.dto';
import { Button, Icon } from '@/lib/ui';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { cn, type CUID } from '@/shared';
import { ACTIONS } from '@/shared/constants/table-actions';
import { ABSENCE_TOASTS } from '@/shared/constants/toast-notifications';
import { useToast } from '@/lib/ui/hooks';
import { deleteDayOff } from '../_actions/delete-day-off.action';

type Props = {
  actions: AbsenceAction[];
  absenceIds: CUID[] | 'all';
  variant?: 'default' | 'large';
};

export const ALLOWED_ACTIONS: AbsenceAction[] = ['delete'];

export function DaysOffMenu({ actions, absenceIds, variant = 'default' }: Props) {
  const t = useTranslations('absences.settings');
  const tNext = useNextTranslations('absences.settings');
  const toast = useToast();

  const allowedActions = actions.filter((action) => ALLOWED_ACTIONS.includes(action));

  const handleAction = async (action: AbsenceAction) => {
    switch (action) {
      case 'delete':
        await deleteDayOff(absenceIds);
        toast(ABSENCE_TOASTS.DELETE);
        break;
    }
  };

  return (
    <Menu
      trigger={
        variant === 'large' ? (
          <Button icon="context" intent="tertiary" size="sm">
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
              'text-warning': action === 'reject' || action === 'delete',
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
  );
}
