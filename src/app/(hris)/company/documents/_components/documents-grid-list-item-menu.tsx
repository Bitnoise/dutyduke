'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Icon } from '@/lib/ui';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { API_ROUTES, type ActionType, type CUID, type DocumentListActions, HRIS_ROUTES, cn } from '@/shared';
import { ACTIONS } from '@/shared/constants/table-actions';

type Props = {
  documentId: CUID;
  variant?: 'small' | 'default';
  actions: DocumentListActions[];
  isAssigned: boolean;
  isEmployeeAction?: boolean;
};

const MENU_ACTIONS: DocumentListActions[] = ['edit', 'open', 'delete'];

export function DocumentsGridListItemMenu({ variant = 'default', actions, isAssigned, documentId }: Props) {
  const t = useTranslations('ctaLabels');
  const tNext = useNextTranslations('ctaLabels');
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
      case 'open':
        window.open(API_ROUTES.documents.open(documentId), '_blank');
        break;
      case 'edit':
        router.push(HRIS_ROUTES.documents.edit(documentId ?? '', category, status, filter));
        break;
      case 'delete':
        router.push(HRIS_ROUTES.documents.delete(documentId ?? '', category, status, filter));
        break;
    }
  };

  return (
    <>
      <Menu
        aria-label={tNext('menu')}
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
      >
        {allowedActions.map((action) => (
          <MenuItem
            key={action.id}
            className="flex items-center gap-x-2.5"
            textValue={tNext('actionsMenu')}
            onAction={() => handleAction(action.id)}
          >
            <div
              className={cn('flex gap-2 text-accent', {
                'text-warning': action.id === 'delete',
              })}
            >
              <Icon name={action.icon} size="xs" />
              <span>{t(action.label)}</span>
            </div>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
