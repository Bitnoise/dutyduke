import { type OrganizationContext } from '@/api/hris';
import { authApi } from '@/api/hris/authentication';

export function authAcl(organizationContext: OrganizationContext) {
  const getLoggedInUser = async () => {
    const api = authApi(organizationContext);

    const user = await api.getMe();

    return {
      locale: user.locale,
      name: `${user.firstName} ${user.lastName}`,
      id: user.id,
    };
  };

  return {
    getLoggedInUser,
  };
}
