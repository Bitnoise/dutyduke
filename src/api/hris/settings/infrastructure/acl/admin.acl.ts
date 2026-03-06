import { type OrganizationContext } from '@/api/hris';
import { type AdminAcl } from '@/api/hris/settings/model/acl';

export function adminAcl(_organizationContext: OrganizationContext): AdminAcl {
  const deleteOrganization = async () => {
    // TODO: Implement organization deletion for single organization
    // Previously used admin API which has been removed
    throw new Error('Organization deletion not implemented for single organization setup');
  };

  return {
    deleteOrganization,
  };
}
