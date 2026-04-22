import { type CUID } from '@/shared';
import { PermissionAction, PermissionScope, ResourceType, type RoleDefinition } from './permissions';

export type PermissionChecker = {
  can: (resource: ResourceType, action: PermissionAction) => boolean;
  canAny: (resource: ResourceType, actions: PermissionAction[]) => boolean;
  canAll: (resource: ResourceType, actions: PermissionAction[]) => boolean;
  getScope: (resource: ResourceType) => PermissionScope | null;
  getFieldAccess: (resource: ResourceType) => Record<string, boolean> | boolean;
  isOwner: () => boolean;
  getRoles: () => RoleDefinition[];
  getIdentityId: () => CUID;
  serialize: () => SerializedPermissions;
};

// Serializable permission data for client components
export type SerializedPermissions = {
  isOwner: boolean;
  permissions: Record<ResourceType, PermissionAction[]>;
  scopes: Record<ResourceType, PermissionScope>;
  fieldAccess: Record<ResourceType, Record<string, boolean> | boolean>;
  identityId: CUID;
};

export function createPermissionChecker(roles: RoleDefinition[], identityId: CUID): PermissionChecker {
  // Check if user has owner role
  const isOwner = roles.some((role) => role.key === 'OWNER');

  // Aggregate all permissions from all roles
  const permissionMap = new Map<ResourceType, Set<PermissionAction>>();
  const scopeMap = new Map<ResourceType, PermissionScope>();
  const fieldAccessMap = new Map<ResourceType, Record<string, boolean>>();

  roles.forEach((role) => {
    role.permissions.forEach((permission) => {
      if (!permissionMap.has(permission.resource)) {
        permissionMap.set(permission.resource, new Set());
      }

      permission.actions.forEach((action) => {
        permissionMap.get(permission.resource)!.add(action);
      });

      // Scope priority: ALL > SELF (if any role grants ALL, use ALL)
      const existingScope = scopeMap.get(permission.resource);
      if (!existingScope || permission.scope === PermissionScope.ALL) {
        scopeMap.set(permission.resource, permission.scope);
      }

      // Merge field access (if any field is accessible via any role, it's accessible)
      if (permission.fieldAccess) {
        const existingFieldAccess = fieldAccessMap.get(permission.resource) || {};
        fieldAccessMap.set(permission.resource, {
          ...existingFieldAccess,
          ...permission.fieldAccess,
        });
      }
    });
  });

  return {
    can: (resource: ResourceType, action: PermissionAction): boolean => {
      // Owner has all permissions
      if (isOwner) return true;

      const actions = permissionMap.get(resource);
      return actions ? actions.has(action) : false;
    },

    canAny: (resource: ResourceType, actions: PermissionAction[]): boolean => {
      if (isOwner) return true;
      return actions.some((action) => {
        const resourceActions = permissionMap.get(resource);
        return resourceActions ? resourceActions.has(action) : false;
      });
    },

    canAll: (resource: ResourceType, actions: PermissionAction[]): boolean => {
      if (isOwner) return true;
      return actions.every((action) => {
        const resourceActions = permissionMap.get(resource);
        return resourceActions ? resourceActions.has(action) : false;
      });
    },

    getScope: (resource: ResourceType): PermissionScope | null => {
      // Owner always has ALL scope
      if (isOwner) return PermissionScope.ALL;

      return scopeMap.get(resource) || null;
    },

    getFieldAccess: (resource: ResourceType): Record<string, boolean> | boolean => {
      // Owner has full access
      if (isOwner) return true;

      return fieldAccessMap.get(resource) || {};
    },

    isOwner: (): boolean => isOwner,

    getRoles: (): RoleDefinition[] => roles,

    getIdentityId: (): CUID => identityId,

    serialize: (): SerializedPermissions => {
      const permissions: Record<string, PermissionAction[]> = {};
      const scopes: Record<string, PermissionScope> = {};
      const fieldAccess: Record<string, Record<string, boolean> | boolean> = {};

      // Convert Map to plain object for serialization
      permissionMap.forEach((actions, resource) => {
        permissions[resource] = Array.from(actions);
      });

      scopeMap.forEach((scope, resource) => {
        scopes[resource] = scope;
      });

      fieldAccessMap.forEach((access, resource) => {
        fieldAccess[resource] = access;
      });

      return {
        isOwner,
        permissions: permissions as Record<ResourceType, PermissionAction[]>,
        scopes: scopes as Record<ResourceType, PermissionScope>,
        fieldAccess: fieldAccess as Record<ResourceType, Record<string, boolean> | boolean>,
        identityId,
      };
    },
  };
}

// Client-side helper to check permissions using serialized data
export function canAccess(
  serialized: SerializedPermissions,
  resource: ResourceType,
  action: PermissionAction,
): boolean {
  if (serialized.isOwner) return true;
  const actions = serialized.permissions[resource];
  return actions ? actions.includes(action) : false;
}

// Mapping of company resources to their employee equivalents
const RESOURCE_PAIRS: Record<ResourceType, ResourceType | null> = {
  [ResourceType.COMPANY_EQUIPMENT]: ResourceType.EMPLOYEE_EQUIPMENT,
  [ResourceType.COMPANY_DOCUMENTS]: ResourceType.EMPLOYEE_DOCUMENTS,
  [ResourceType.COMPANY_BENEFITS]: null, // Benefits don't have a direct employee resource, handled separately
  [ResourceType.COMPANY_ABSENCES]: ResourceType.EMPLOYEE_ABSENCES,
  [ResourceType.EMPLOYEES]: null,
  [ResourceType.COMPANY_SETTINGS]: null,
  [ResourceType.EMPLOYEE_PROFILE]: null,
  [ResourceType.EMPLOYEE_DOCUMENTS]: null,
  [ResourceType.EMPLOYEE_EQUIPMENT]: null,
  [ResourceType.EMPLOYEE_ABSENCES]: null,
  [ResourceType.EMPLOYEE_FEEDBACK]: null,
  [ResourceType.EMPLOYEE_EARNINGS]: null,
};

/**
 * Result of checking company/employee resource permissions
 */
export type ResourcePermissionCheck = {
  hasPermission: boolean;
  employeeResource: ResourceType | null;
  scope: PermissionScope | null;
  requiresOwnershipVerification: boolean;
};

export type EmployeeViewAccess = {
  // Any grant: EMPLOYEES:VIEW or EMPLOYEE_PROFILE:VIEW.
  canView: boolean;
  // ALL scope on at least one of the grants — allows viewing anyone.
  hasCompanyWideAccess: boolean;
};

/**
 * Resolves whether the caller can view employee records, and whether that access
 * extends company-wide. An employee can be reached via two grants — the company
 * EMPLOYEES resource or the own-profile EMPLOYEE_PROFILE resource — so both layers
 * (controllers and routes) need to agree on how they combine.
 */
export function getEmployeeViewAccess(checker: PermissionChecker): EmployeeViewAccess {
  const canViewEmployees = checker.can(ResourceType.EMPLOYEES, PermissionAction.VIEW);
  const canViewEmployeeProfile = checker.can(ResourceType.EMPLOYEE_PROFILE, PermissionAction.VIEW);
  const employeesScope = checker.getScope(ResourceType.EMPLOYEES);
  const profileScope = checker.getScope(ResourceType.EMPLOYEE_PROFILE);

  return {
    canView: canViewEmployees || canViewEmployeeProfile,
    hasCompanyWideAccess:
      (canViewEmployees && employeesScope === PermissionScope.ALL) ||
      (canViewEmployeeProfile && profileScope === PermissionScope.ALL),
  };
}

/**
 * Checks if user has permission for either company-level or employee-level resource.
 * Returns permission details including whether ownership verification is needed for SELF scope.
 */
export function checkResourcePermission(
  checker: PermissionChecker,
  companyResource: ResourceType,
  action: PermissionAction,
): ResourcePermissionCheck {
  // Owner has all permissions
  if (checker.isOwner()) {
    return {
      hasPermission: true,
      employeeResource: null,
      scope: PermissionScope.ALL,
      requiresOwnershipVerification: false,
    };
  }

  // Check company-level permission first
  if (checker.can(companyResource, action)) {
    return {
      hasPermission: true,
      employeeResource: null,
      scope: PermissionScope.ALL,
      requiresOwnershipVerification: false,
    };
  }

  // Check employee-level permission
  const employeeResource = RESOURCE_PAIRS[companyResource];
  if (!employeeResource) {
    return {
      hasPermission: false,
      employeeResource: null,
      scope: null,
      requiresOwnershipVerification: false,
    };
  }

  if (!checker.can(employeeResource, action)) {
    return {
      hasPermission: false,
      employeeResource: null,
      scope: null,
      requiresOwnershipVerification: false,
    };
  }

  // Employee permission exists, check scope
  const scope = checker.getScope(employeeResource);
  return {
    hasPermission: true,
    employeeResource,
    scope,
    requiresOwnershipVerification: scope === PermissionScope.SELF,
  };
}
