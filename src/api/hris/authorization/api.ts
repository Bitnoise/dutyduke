import { type OrganizationContext } from '@/api/hris';
import { rolesController } from './infrastructure/controllers/roles.controller';

export function authorizationApi(organizationContext: OrganizationContext) {
  const rolesControllerImpl = rolesController(organizationContext);

  return {
    roles: rolesControllerImpl,
  };
}
