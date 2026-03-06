import { type IconNames } from '@/lib/ui/icons';
import { type ActionType } from '..';

const actionIcons = {
  edit: 'edit-2',
  delete: 'trash',
  assign: 'link',
  view: 'search-normal',
  download: 'document-download',
};

export const getActionIconName = (action: ActionType) =>
  actionIcons[action as keyof typeof actionIcons] as IconNames;
