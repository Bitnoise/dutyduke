import { type IconNames } from '@/lib/ui/icons';
import { HRIS_ROUTES } from '@/shared/constants/routes';
import { PermissionAction, ResourceType } from '@/api/hris/authorization/permissions';

type NavigationLink = {
  icon: IconNames;
  label: string;
  href: string;
  _access?: {
    resource: ResourceType;
    action: PermissionAction;
  };
};

export const navigationLinks: Record<string, NavigationLink[]> = {
  company: [
    {
      icon: 'people',
      label: 'employeesList',
      href: HRIS_ROUTES.employees.base,
      _access: {
        resource: ResourceType.EMPLOYEES,
        action: PermissionAction.VIEW,
      },
    },
    {
      icon: 'sun-fog',
      label: 'absences',
      href: HRIS_ROUTES.company.absences.base,
      _access: {
        resource: ResourceType.COMPANY_ABSENCES,
        action: PermissionAction.VIEW,
      },
    },
    {
      icon: 'monitor-mobile',
      label: 'equipment',
      href: HRIS_ROUTES.equipment.base,
      _access: {
        resource: ResourceType.COMPANY_EQUIPMENT,
        action: PermissionAction.VIEW,
      },
    },
    {
      icon: 'document-text',
      label: 'documents',
      href: HRIS_ROUTES.documents.base,
      _access: {
        resource: ResourceType.COMPANY_DOCUMENTS,
        action: PermissionAction.VIEW,
      },
    },
    {
      icon: 'medal-star',
      label: 'benefits',
      href: HRIS_ROUTES.benefits.base,
      _access: {
        resource: ResourceType.COMPANY_BENEFITS,
        action: PermissionAction.VIEW,
      },
    },
    {
      icon: 'building',
      label: 'general',
      href: HRIS_ROUTES.company.general,
      _access: {
        resource: ResourceType.COMPANY_SETTINGS,
        action: PermissionAction.VIEW,
      },
    },
  ],
};
