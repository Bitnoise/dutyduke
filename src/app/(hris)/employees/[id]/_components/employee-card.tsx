import { Suspense, type PropsWithChildren } from 'react';
import { cn, type CUID } from '@/shared';
import { hrisApi } from '@/api/hris';
import { EmployeeHeader } from '@/app/(hris)/employees/[id]/_components/employee-header';
import { EmployeeTabs } from '@/app/(hris)/employees/[id]/_components/employee-tabs';

import { ExpandableEmployeesList } from '@/app/(hris)/employees/[id]/_components/expandable-employee-list';
import { EmployeeListSkeleton, EmployeesList } from '@/app/(hris)/employees/[id]/_components/employees-list';
import { getPermissionChecker } from '@/api/hris/authorization';
import { Card } from '@/lib/ui';

type Props = {
  employeeId: CUID;
  query?: string;
  showHeader?: boolean;
  showTabs?: boolean;
  className?: string;
};

export async function EmployeeCard({
  children,
  employeeId,
  query,
  showHeader = true,
  showTabs = true,
  className,
}: PropsWithChildren<Props>): Promise<JSX.Element> {
  const api = hrisApi;
  const [me, permissionChecker] = await Promise.all([api.auth.getMe(), getPermissionChecker()]);

  const isOwner = me.roles.includes('OWNER');
  const permissions = permissionChecker.serialize();

  return (
    <div className="relative flex min-h-full flex-1">
      {isOwner && (
        <ExpandableEmployeesList>
          <Suspense key={query} fallback={<EmployeeListSkeleton />}>
            <EmployeesList api={api} employeeId={employeeId} query={query} />
          </Suspense>
        </ExpandableEmployeesList>
      )}
      <section className="relative z-10 flex-1 shadow-[0_4px_15px_0_rgba(39,55,75,0.06)]">
        <Card id="ExpandableCard">
          {showHeader && <EmployeeHeader api={api} employeeId={employeeId} />}
          {showTabs && <EmployeeTabs employeeId={employeeId} permissions={permissions} />}
          <div className={cn('min-h-full pt-2 md:pt-8', className)}>{children}</div>
        </Card>
      </section>
    </div>
  );
}
