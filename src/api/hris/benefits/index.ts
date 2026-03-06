import { type OrganizationContext } from '@/api/hris';
import { benefitsController } from './infrastructure/controllers';

export function benefitsApi(organizationContext: OrganizationContext) {
  const controller = benefitsController(organizationContext);

  return {
    ...controller,
  };
}
