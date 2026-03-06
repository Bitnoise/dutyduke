import { type PropsWithChildren } from 'react';
// import { redirect } from 'next/navigation';
import { MainNavigation, MobileNavigation, ToastQueue } from '@/lib/ui';
import { Breadcrumbs } from '@/lib/ui/components/breadcrumbs';
// import { AUTH_ROUTES } from '@/shared';
import { hrisApi } from '@/api/hris';
import { Header } from '@/lib/ui/components/header';
import { AccountMenu } from '@/lib/ui/components/account-menu';
import { getPermissionChecker } from '@/api/hris/authorization';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: PropsWithChildren): Promise<JSX.Element> {
  const [account, permissionChecker] = await Promise.all([hrisApi.auth.getMe(), getPermissionChecker()]);

  // Serialize permissions for client components
  const permissions = permissionChecker.serialize();

  return (
    <>
      <Header api={hrisApi}>
        <AccountMenu api={hrisApi} />
        <MobileNavigation account={account} permissions={permissions} />
      </Header>
      <div className="flex min-h-[calc(100svh_-_3.5rem)]">
        <MainNavigation account={account} permissions={permissions} />
        <div className="flex-1 bg-background md:rounded-tl-xl">
          <main className="flex size-full max-w-[1440px] flex-1 flex-col overflow-y-auto md:gap-y-4 md:p-4">
            <Breadcrumbs className="flex h-4 flex-wrap gap-1 pl-4 md:pl-8" />
            <div className="size-full ">{children}</div>
          </main>
        </div>
      </div>
      <ToastQueue />
    </>
  );
}
