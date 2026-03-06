'use client';
import { useMemo } from 'react';
import { type CUID, EMPLOYEE_TABS } from '@/shared';
import { BottomTabNav, TabList } from '@/lib/ui/components/tab-nav';
import { type SerializedPermissions, canAccess } from '@/api/hris/authorization/client';

type Props = {
  employeeId: CUID;
  permissions: SerializedPermissions;
};

export function EmployeeTabs({ employeeId, permissions }: Props): JSX.Element {
  const tabs = useMemo(() => {
    // Filter tabs based on actual permissions
    return EMPLOYEE_TABS.filter((tab) => {
      if (!tab._access) {
        // If no access control defined, allow all users
        return true;
      }
      // Check if user has the required permission
      return canAccess(permissions, tab._access.resource, tab._access.action);
    }).map((tab) => ({ ...tab, href: tab.href(employeeId) }));
  }, [employeeId, permissions]);

  return (
    <nav className="relative z-40">
      <BottomTabNav className="md:hidden" tabs={tabs} />
      <TabList className="hidden md:flex" tabs={tabs} />
    </nav>
  );
}
