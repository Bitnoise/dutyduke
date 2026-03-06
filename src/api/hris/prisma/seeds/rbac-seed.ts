import {
  type OrganizationPrismaClient,
  type Prisma,
  type ResourceType as PrismaResourceType,
  type PermissionScope as PrismaPermissionScope,
  type PermissionAction as PrismaPermissionAction,
} from '../client';

// Inline enum values to avoid importing React-dependent modules
const ResourceType = {
  EMPLOYEES: 'EMPLOYEES',
  COMPANY_ABSENCES: 'COMPANY_ABSENCES',
  COMPANY_DOCUMENTS: 'COMPANY_DOCUMENTS',
  COMPANY_EQUIPMENT: 'COMPANY_EQUIPMENT',
  COMPANY_BENEFITS: 'COMPANY_BENEFITS',
  COMPANY_SETTINGS: 'COMPANY_SETTINGS',
  EMPLOYEE_PROFILE: 'EMPLOYEE_PROFILE',
  EMPLOYEE_DOCUMENTS: 'EMPLOYEE_DOCUMENTS',
  EMPLOYEE_EQUIPMENT: 'EMPLOYEE_EQUIPMENT',
  EMPLOYEE_ABSENCES: 'EMPLOYEE_ABSENCES',
  EMPLOYEE_FEEDBACK: 'EMPLOYEE_FEEDBACK',
  EMPLOYEE_EARNINGS: 'EMPLOYEE_EARNINGS',
} as const;

const PermissionAction = {
  VIEW: 'VIEW',
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  DELETE: 'DELETE',
  ASSIGN: 'ASSIGN',
  EXPORT: 'EXPORT',
} as const;

const PermissionScope = {
  ALL: 'ALL',
  SELF: 'SELF',
} as const;

/**
 * Seed the OWNER system role with all permissions
 * This should be run after the RBAC migration
 */
export async function seedOwnerRole(db: OrganizationPrismaClient): Promise<void> {
  // Check if OWNER role already exists
  const existingOwner = await db.role.findUnique({
    where: { key: 'OWNER' },
  });

  if (existingOwner) {
    console.log('OWNER role already exists, skipping seed');
    return;
  }

  // Create OWNER role
  const ownerRole = await db.role.create({
    data: {
      name: 'Owner',
      key: 'OWNER',
      description: 'System role with full access to all resources',
      isSystem: true,
    },
  });

  // Create permissions for all resources
  const allResources = Object.values(ResourceType);

  const permissions: Prisma.RolePermissionCreateManyInput[] = allResources.map((resource) => {
    // Determine which actions are applicable to each resource
    let actions: (typeof PermissionAction)[keyof typeof PermissionAction][] = [];

    switch (resource) {
      case ResourceType.EMPLOYEES:
        actions = [
          PermissionAction.VIEW,
          PermissionAction.CREATE,
          PermissionAction.EDIT,
          PermissionAction.DELETE,
          PermissionAction.ASSIGN,
          PermissionAction.EXPORT,
        ];
        break;
      case ResourceType.COMPANY_ABSENCES:
      case ResourceType.COMPANY_DOCUMENTS:
      case ResourceType.COMPANY_BENEFITS:
        actions = [
          PermissionAction.VIEW,
          PermissionAction.CREATE,
          PermissionAction.EDIT,
          PermissionAction.DELETE,
          PermissionAction.EXPORT,
        ];
        break;
      case ResourceType.COMPANY_EQUIPMENT:
        actions = [
          PermissionAction.VIEW,
          PermissionAction.CREATE,
          PermissionAction.EDIT,
          PermissionAction.DELETE,
          PermissionAction.ASSIGN,
        ];
        break;
      case ResourceType.COMPANY_SETTINGS:
        actions = [
          PermissionAction.VIEW,
          PermissionAction.CREATE,
          PermissionAction.EDIT,
          PermissionAction.DELETE,
        ];
        break;
      case ResourceType.EMPLOYEE_PROFILE:
      case ResourceType.EMPLOYEE_EARNINGS:
        actions = [PermissionAction.VIEW, PermissionAction.EDIT];
        break;
      case ResourceType.EMPLOYEE_DOCUMENTS:
        actions = [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.DELETE];
        break;
      case ResourceType.EMPLOYEE_EQUIPMENT:
        actions = [PermissionAction.VIEW, PermissionAction.ASSIGN];
        break;
      case ResourceType.EMPLOYEE_ABSENCES:
        actions = [
          PermissionAction.VIEW,
          PermissionAction.CREATE,
          PermissionAction.EDIT,
          PermissionAction.DELETE,
        ];
        break;
      case ResourceType.EMPLOYEE_FEEDBACK:
        actions = [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.EDIT];
        break;
      default:
        actions = [PermissionAction.VIEW];
    }

    return {
      roleId: ownerRole.id,
      resource: resource as unknown as PrismaResourceType,
      actions: actions as unknown as PrismaPermissionAction[],
      scope: PermissionScope.ALL as unknown as PrismaPermissionScope,
      // fieldAccess omitted - Owner has full field access (undefined means all fields)
    };
  });

  // Create all permissions
  await db.rolePermission.createMany({
    data: permissions,
  });

  console.log(`Created OWNER role with ${permissions.length} permissions`);
}

/**
 * Migrate existing OWNER users from old IdentityRole to new Role system
 * This should be run after seeding the OWNER role
 */
export async function migrateOwnerUsers(db: OrganizationPrismaClient): Promise<void> {
  // Get OWNER role
  const ownerRole = await db.role.findUnique({
    where: { key: 'OWNER' },
  });

  if (!ownerRole) {
    throw new Error('OWNER role not found. Run seedOwnerRole first.');
  }

  // Find all identities that have OWNER in the old IdentityRole table
  // Note: This assumes the old IdentityRole table still exists with the role enum
  // During migration, we'll need to handle this transition

  // For now, this is a placeholder - the actual migration will be handled
  // in the SQL migration script that transitions from enum to roleId
  console.log('Owner user migration should be handled in the SQL migration script');
}
