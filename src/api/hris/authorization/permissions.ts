export enum ResourceType {
  EMPLOYEES = 'EMPLOYEES',
  COMPANY_ABSENCES = 'COMPANY_ABSENCES',
  COMPANY_DOCUMENTS = 'COMPANY_DOCUMENTS',
  COMPANY_EQUIPMENT = 'COMPANY_EQUIPMENT',
  COMPANY_BENEFITS = 'COMPANY_BENEFITS',
  COMPANY_SETTINGS = 'COMPANY_SETTINGS',
  EMPLOYEE_PROFILE = 'EMPLOYEE_PROFILE',
  EMPLOYEE_DOCUMENTS = 'EMPLOYEE_DOCUMENTS',
  EMPLOYEE_EQUIPMENT = 'EMPLOYEE_EQUIPMENT',
  EMPLOYEE_ABSENCES = 'EMPLOYEE_ABSENCES',
  EMPLOYEE_FEEDBACK = 'EMPLOYEE_FEEDBACK',
  EMPLOYEE_EARNINGS = 'EMPLOYEE_EARNINGS',
}

export enum PermissionAction {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  ASSIGN = 'ASSIGN',
  EXPORT = 'EXPORT',
}

export enum PermissionScope {
  ALL = 'ALL', // Access to all data (company-wide)
  SELF = 'SELF', // Access only to own data
}

export type Permission = {
  resource: ResourceType;
  actions: PermissionAction[];
  scope: PermissionScope;
  fieldAccess?: Record<string, boolean>;
};

export type RolePermissions = Permission[];

export type RoleDefinition = {
  id: string;
  name: string;
  key: string;
  description?: string;
  isSystem: boolean;
  permissions: RolePermissions;
};
