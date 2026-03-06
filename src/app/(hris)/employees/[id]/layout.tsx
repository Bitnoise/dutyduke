import { type PropsWithChildren } from 'react';
import { type Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { HRIS_ROUTES, type CUID } from '@/shared';
import { hrisApi } from '@/api/hris';
import {
  getPermissionChecker,
  ResourceType,
  PermissionAction,
  PermissionScope,
} from '@/api/hris/authorization';

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

  // Check if user has VIEW permission for EMPLOYEES
  const canViewEmployees = permissionChecker.can(ResourceType.EMPLOYEES, PermissionAction.VIEW);

  if (!canViewEmployees) {
    return redirect(HRIS_ROUTES.employees.base);
  }

  // Check scope: if SELF scope, only allow viewing own profile
  const scope = permissionChecker.getScope(ResourceType.EMPLOYEES);
  if (scope === PermissionScope.SELF && me.id !== params.id) {
    return redirect(HRIS_ROUTES.employees.base);
  }

  return <div className="flex min-h-full flex-col">{props.children}</div>;
}
