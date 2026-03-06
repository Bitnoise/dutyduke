import { type OrganizationContext } from '@/api/hris';
import { companyController } from '@/api/hris/company/infrastructure/controllers';

export function companyApi(organizationContext: OrganizationContext) {
  return { ...companyController(organizationContext) };
}
