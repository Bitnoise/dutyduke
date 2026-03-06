import { redirect } from 'next/navigation';
import { type PropsWithChildren } from 'react';
import { HRIS_ROUTES, type CUID } from '@/shared';
import { hrisApi } from '@/api/hris';
import {
  getPermissionChecker,
  ResourceType,
  PermissionAction,
  PermissionScope,
} from '@/api/hris/authorization';

type Props = { params: Promise<{ id: CUID }> };

export default async function AbsenceLayout(props: PropsWithChildren<Props>) {
  const { id } = await props.params;
  const api = hrisApi;
  const [me, permissionChecker] = await Promise.all([api.auth.getMe(), getPermissionChecker()]);

  // Check if user has VIEW permission for EMPLOYEE_ABSENCES
  const canViewAbsences = permissionChecker.can(ResourceType.EMPLOYEE_ABSENCES, PermissionAction.VIEW);

  if (!canViewAbsences) {
    return redirect(HRIS_ROUTES.employees.general.base(id));
  }

  // Check scope: if SELF scope, only allow viewing own absences
  const scope = permissionChecker.getScope(ResourceType.EMPLOYEE_ABSENCES);
  if (scope === PermissionScope.SELF && me.id !== id) {
    return redirect(HRIS_ROUTES.employees.general.base(id));
  }

  return <>{props.children}</>;
}
