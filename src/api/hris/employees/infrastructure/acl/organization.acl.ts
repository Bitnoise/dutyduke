import { type CUID } from '@/shared';

export function organizationAcl(_organizationId: CUID) {
  const getOrganizationOverview = async (): Promise<{ name: string } | null> => {
    // Single organization - return default name
    // TODO: Get organization name from environment or configuration
    return {
      name: process.env.NEXT_PUBLIC_ORGANIZATION_NAME || 'DutyDuke',
    };
  };

  return {
    getOrganizationOverview,
  };
}
