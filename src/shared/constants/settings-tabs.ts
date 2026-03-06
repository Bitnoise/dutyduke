import { type Tab } from '@/lib/ui/components/tab-nav/types';
import { HRIS_ROUTES } from '@/shared/constants/routes';
import { ResourceType, PermissionAction } from '@/api/hris/authorization/permissions';

export const SETTINGS_TABS: Array<Tab & { _access?: { resource: ResourceType; action: PermissionAction } }> =
  [
    {
      id: 'general',
      label: 'general',
      icon: 'task',
      href: HRIS_ROUTES.settings.general,
    },
    {
      id: 'changePassword',
      label: 'changePassword',
      icon: 'settings',
      href: HRIS_ROUTES.settings.changePassword,
    },
    {
      id: 'roles',
      label: 'roles',
      icon: 'people',
      href: HRIS_ROUTES.settings.roles,
      _access: {
        resource: ResourceType.COMPANY_SETTINGS,
        action: PermissionAction.VIEW,
      },
    },
    {
      id: 'danger',
      label: 'danger',
      icon: 'warning-2',
      href: HRIS_ROUTES.settings.danger,
      _access: {
        resource: ResourceType.COMPANY_SETTINGS,
        action: PermissionAction.DELETE,
      },
    },
  ];
