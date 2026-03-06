import { type OrganizationAcl } from '@/api/hris/authentication/model/acl';
import { type CUID } from '@/shared';

export function organizationAcl(organizationId: CUID): OrganizationAcl {
  const addUser = async (email: string) => {
    // TODO: Implement user addition for single organization
    // Previously used admin API which has been removed
    console.log('Add user to organization:', { email, organizationId });
  };

  const deleteUser = async (userId: CUID) => {
    // TODO: Implement user deletion for single organization
    // Previously used admin API which has been removed
    console.log('Delete user from organization:', { userId, organizationId });
  };

  const getUserByEmail = async (email: string) => {
    // TODO: Implement user lookup for single organization
    // Previously used admin API which has been removed
    console.log('Get user by email:', { email });
    return null;
  };

  return {
    addUser,
    deleteUser,
    getUserByEmail,
  };
}
