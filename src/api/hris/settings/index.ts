import { type OrganizationContext } from '@/api/hris';
import { settingsController } from '@/api/hris/settings/infrastructure/controllers';

export function settingsApi(organizationContext: OrganizationContext) {
  return {
    ...settingsController(organizationContext),
  };
}
