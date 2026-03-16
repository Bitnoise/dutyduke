import { type OrganizationContext } from '@/api/hris';
import { companyQueries } from '@/api/hris/company/infrastructure/database/queries/company.queries';

export function organizationAcl(organizationContext: OrganizationContext) {
  const companyQueriesImpl = companyQueries(organizationContext.db);

  const getOrganizationOverview = async (): Promise<{ name: string } | null> => {
    const company = await companyQueriesImpl.getCompany();

    return {
      name: company?.name || 'DutyDuke',
    };
  };

  return {
    getOrganizationOverview,
  };
}
