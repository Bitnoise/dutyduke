'use client';

import { useState } from 'react';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Icon } from '@/lib/ui';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { type ActionType, cn, type CUID, type Nullable, type PropsWithClassName } from '@/shared';
import { ACTIONS } from '@/shared/constants/table-actions';
import { DICTIONARY_TOASTS } from '@/shared/constants/toast-notifications';
import { DeleteModal } from '../modal/delete-modal';
import { useModal, useToast } from '../../hooks';

export type DictionaryAction = Extract<ActionType, 'delete'>;

type Props = {
  itemId: CUID;
  variant?: 'small' | 'default';
  actions: DictionaryAction[];
  onDelete(itemId: string): Promise<void>;
};

const MENU_ACTIONS: DictionaryAction[] = ['delete'];

export function DictionaryItemMenu({
  itemId,
  variant = 'default',
  className,
  actions,
  onDelete,
}: PropsWithClassName<Props>): Nullable<JSX.Element> {
  const t = useTranslations('ctaLabels');
  const tNext = useNextTranslations('ctaLabels');
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const toast = useToast();

  const allowedActions = actions
    .filter((action) => MENU_ACTIONS.includes(action))
    .map((action) => ACTIONS[action]);

  if (!allowedActions.length) {
    return null;
  }
  const handleDeleteDocument = async () => {
    setIsDeleting(true);
    await onDelete(itemId);
    setIsDeleting(false);
    toast(DICTIONARY_TOASTS.DELETE);
    closeModal();
  };

  const handleAction = async (action: ActionType) => {
    switch (action) {
      case 'delete':
        openModal();
        break;
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
        {allowedActions.map((action) => (
          <MenuItem
            key={action.id}
            className={cn('flex items-center gap-x-2.5', {
              'text-warning': action.id === 'delete',
            })}
            isDisabled={isDeleting}
            textValue={tNext(action.label)}
            onAction={() => handleAction(action.id)}
          >
            <Icon name={action.icon} size="xs" />
            <span>{t(action.label)}</span>
          </MenuItem>
        ))}
      </Menu>

      <DeleteModal isOpen={isOpen} onClose={closeModal} onOk={handleDeleteDocument} />
    </>
  );
}
