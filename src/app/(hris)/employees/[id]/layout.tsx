import { type PropsWithChildren } from 'react';
import { type Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { HRIS_ROUTES, type CUID } from '@/shared';
import { hrisApi } from '@/api/hris';
import { getEmployeeViewAccess, getPermissionChecker } from '@/api/hris/authorization';

type Props = { params: Promise<{ id: CUID }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'employees.seo' });

  const api = hrisApi;

  const employee = await api.employees.getEmployeeById(params.id);

  return {
    title: t('employeeTitle', { employeeName: `${employee.firstName} ${employee.lastName}` }),
  };
}

export default async function EmployeesLayout(props: PropsWithChildren<Props>) {
  const params = await props.params;
  const api = hrisApi;
  const [me, permissionChecker] = await Promise.all([api.auth.getMe(), getPermissionChecker()]);
  const { canView, hasCompanyWideAccess } = getEmployeeViewAccess(permissionChecker);

  // Main nav is permission-filtered, so reaching here without any view grant means a
  // direct navigation. Dashboard is the safe fallback — its widgets are already gated
  // per permission and render gracefully for minimal roles.
  if (!canView) {
    return redirect(HRIS_ROUTES.dashboard);
  }

  if (!hasCompanyWideAccess && me.id !== params.id) {
    return redirect(HRIS_ROUTES.employees.general.base(me.id));
  }

  return <div className="flex min-h-full flex-col">{props.children}</div>;
}
