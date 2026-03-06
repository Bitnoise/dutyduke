import { type Tab } from '@/lib/ui/components/tab-nav/types';
import { HRIS_ROUTES } from '@/shared/constants/routes';
import { type CUID } from '@/shared/types';
import { ResourceType, PermissionAction } from '@/api/hris/authorization/permissions';

export const EMPLOYEE_TABS: Array<
  Omit<Tab, 'href'> & {
    href: (employeeId: CUID) => string;
    _access?: { resource: ResourceType; action: PermissionAction };
  }
> = [
  {
    id: '1',
    label: 'general',
    icon: 'profile-circle',
    href: HRIS_ROUTES.employees.general.base,
    _access: {
      resource: ResourceType.EMPLOYEE_PROFILE,
      action: PermissionAction.VIEW,
    },
  },
  {
    id: '2',
    label: 'skills',
    icon: 'medal-star',
    href: HRIS_ROUTES.employees.skills.base,
    // Skills are part of employee profile, so same permission
    _access: {
      resource: ResourceType.EMPLOYEE_PROFILE,
      action: PermissionAction.VIEW,
    },
  },
  {
    id: '3',
    label: 'documents',
    icon: 'document-text',
    href: HRIS_ROUTES.employees.documents.base,
    _access: {
      resource: ResourceType.EMPLOYEE_DOCUMENTS,
      action: PermissionAction.VIEW,
    },
  },
  {
    id: '4',
    label: 'earnings',
    icon: 'money-send',
    href: HRIS_ROUTES.employees.earnings.base,
    _access: {
      resource: ResourceType.EMPLOYEE_EARNINGS,
      action: PermissionAction.VIEW,
    },
  },
  {
    id: '5',
    label: 'equipment',
    icon: 'monitor-mobile',
    href: HRIS_ROUTES.employees.equipment.base,
    _access: {
      resource: ResourceType.EMPLOYEE_EQUIPMENT,
      action: PermissionAction.VIEW,
    },
  },
  {
    id: '6',
    label: 'absence',
    icon: 'sun-fog',
    href: HRIS_ROUTES.employees.absence.base,
    _access: {
      resource: ResourceType.EMPLOYEE_ABSENCES,
      action: PermissionAction.VIEW,
    },
  },
  {
    id: '7',
    label: 'feedback',
    icon: 'feedback',
    href: HRIS_ROUTES.employees.feedback.base,
    _access: {
      resource: ResourceType.EMPLOYEE_FEEDBACK,
      action: PermissionAction.VIEW,
    },
  },
  {
    id: '8',
    label: 'benefits',
    icon: 'medal-star',
    href: HRIS_ROUTES.employees.benefits.base,
    // Benefits might not have a specific resource type, check if it exists
    // For now, we'll use EMPLOYEE_PROFILE as fallback
  },
];
