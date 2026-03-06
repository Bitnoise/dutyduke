'use client';
import { useMemo } from 'react';
import { BottomTabNav, TabList } from '@/lib/ui';
import { SETTINGS_TABS } from '@/shared';
import { type SerializedPermissions, canAccess } from '@/api/hris/authorization/client';

type Props = {
  permissions: SerializedPermissions;
};

export function SettingsTabs({ permissions }: Props): JSX.Element {
  const settingsTabs = useMemo(() => {
    // Filter tabs based on actual permissions
    return SETTINGS_TABS.filter((tab) => {
      if (!tab._access) {
        // If no access control defined, allow all users (e.g., general, change password)
        return true;
      }
      // Check if user has the required permission
      return canAccess(permissions, tab._access.resource, tab._access.action);
    });
  }, [permissions]);

  return (
    <nav className="relative z-40">
      <BottomTabNav className="md:hidden" tabs={settingsTabs} />
      <TabList className="hidden md:flex" tabs={settingsTabs} />
    </nav>
  );
}
