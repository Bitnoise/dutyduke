import { redirect } from 'next/navigation';
import { type PropsWithChildren } from 'react';
import { getPermissionChecker } from '@/api/hris/authorization';
import { PermissionAction, ResourceType } from '@/api/hris/authorization/permissions';
import { HRIS_ROUTES } from '@/shared';
import { Card } from '@/lib/ui';

export default async function BenefitsLayout({
  children,
  modals,
}: PropsWithChildren<{ modals: React.ReactNode }>) {
  const permissionChecker = await getPermissionChecker();

  // Check if user has VIEW permission for COMPANY_BENEFITS
  const canViewBenefits = permissionChecker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.VIEW);

  if (!canViewBenefits) {
    return redirect(HRIS_ROUTES.dashboard);
  }

  return (
    <Card id="ExpandableCard">
      {modals}
      {children}
    </Card>
  );
}
