import { redirect } from 'next/navigation';
import { type PropsWithChildren } from 'react';
import { getPermissionChecker } from '@/api/hris/authorization';
import { PermissionAction, ResourceType } from '@/api/hris/authorization/permissions';
import { HRIS_ROUTES } from '@/shared';

export default async function Layout({ children }: PropsWithChildren) {
  const permissionChecker = await getPermissionChecker();

  // Check if user has VIEW permission for COMPANY_ABSENCES
  const canViewAbsences = permissionChecker.can(ResourceType.COMPANY_ABSENCES, PermissionAction.VIEW);

  if (!canViewAbsences) {
    return redirect(HRIS_ROUTES.dashboard);
  }

  return children;
}
