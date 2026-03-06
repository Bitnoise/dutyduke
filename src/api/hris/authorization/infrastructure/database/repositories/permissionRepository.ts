import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { type CUID } from '@/shared';
import {
  type Permission,
  type PermissionAction,
  type PermissionScope,
  type ResourceType,
  type RoleDefinition,
} from '@/api/hris/authorization';

export type PermissionRepository = {
  getRolesByIdentityId: (identityId: CUID) => Promise<RoleDefinition[]>;
  getRoleByKey: (key: string) => Promise<RoleDefinition | null>;
  getRoleById: (roleId: CUID) => Promise<RoleDefinition | null>;
  getAllRoles: () => Promise<RoleDefinition[]>;
  createRole: (
    name: string,
    key: string,
    description: string | null,
    permissions: Permission[],
  ) => Promise<RoleDefinition>;
  updateRolePermissions: (roleId: CUID, permissions: Permission[]) => Promise<void>;
  updateRole: (roleId: CUID, name: string, description: string | null) => Promise<void>;
  deleteRole: (roleId: CUID) => Promise<void>;
  assignRoleToIdentity: (identityId: CUID, roleId: CUID) => Promise<void>;
  removeRoleFromIdentity: (identityId: CUID, roleId: CUID) => Promise<void>;
  getIdentityRoleCounts: () => Promise<Map<string, number>>;
  getRolesForIdentity: (identityId: CUID) => Promise<RoleDefinition[]>;
};

export function permissionRepository(db: OrganizationPrismaClient): PermissionRepository {
  return {
    getRolesByIdentityId: async (identityId: CUID): Promise<RoleDefinition[]> => {
      const identityRoles = await db.identityRole.findMany({
        where: { identityId },
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
      });

      return identityRoles.map(({ role }) => ({
        id: role.id,
        name: role.name,
        key: role.key,
        description: role.description ?? undefined,
        isSystem: role.isSystem,
        permissions: role.permissions.map((p) => ({
          resource: p.resource as ResourceType,
          actions: p.actions as PermissionAction[],
          scope: p.scope as PermissionScope,
          fieldAccess: (p.fieldAccess as Record<string, boolean> | null) ?? undefined,
        })),
      }));
    },

    getRoleByKey: async (key: string): Promise<RoleDefinition | null> => {
      const role = await db.role.findUnique({
        where: { key },
        include: { permissions: true },
      });

      if (!role) return null;

      return {
        id: role.id,
        name: role.name,
        key: role.key,
        description: role.description ?? undefined,
        isSystem: role.isSystem,
        permissions: role.permissions.map((p) => ({
          resource: p.resource as ResourceType,
          actions: p.actions as PermissionAction[],
          scope: p.scope as PermissionScope,
          fieldAccess: (p.fieldAccess as Record<string, boolean> | null) ?? undefined,
        })),
      };
    },

    getRoleById: async (roleId: CUID): Promise<RoleDefinition | null> => {
      const role = await db.role.findUnique({
        where: { id: roleId },
        include: { permissions: true },
      });

      if (!role) return null;

      return {
        id: role.id,
        name: role.name,
        key: role.key,
        description: role.description ?? undefined,
        isSystem: role.isSystem,
        permissions: role.permissions.map((p) => ({
          resource: p.resource as ResourceType,
          actions: p.actions as PermissionAction[],
          scope: p.scope as PermissionScope,
          fieldAccess: (p.fieldAccess as Record<string, boolean> | null) ?? undefined,
        })),
      };
    },

    getAllRoles: async (): Promise<RoleDefinition[]> => {
      const roles = await db.role.findMany({
        include: { permissions: true },
        orderBy: [{ isSystem: 'desc' }, { name: 'asc' }],
      });

      return roles.map((role) => ({
        id: role.id,
        name: role.name,
        key: role.key,
        description: role.description ?? undefined,
        isSystem: role.isSystem,
        permissions: role.permissions.map((p) => ({
          resource: p.resource as ResourceType,
          actions: p.actions as PermissionAction[],
          scope: p.scope as PermissionScope,
          fieldAccess: (p.fieldAccess as Record<string, boolean> | null) ?? undefined,
        })),
      }));
    },

    createRole: async (
      name: string,
      key: string,
      description: string | null,
      permissions: Permission[],
    ): Promise<RoleDefinition> => {
      const role = await db.role.create({
        data: {
          name,
          key,
          description,
          isSystem: false,
          permissions: {
            create: permissions.map((p) => ({
              resource: p.resource,
              actions: p.actions,
              scope: p.scope,
              fieldAccess: p.fieldAccess,
            })),
          },
        },
        include: { permissions: true },
      });

      if (!role) {
        throw new Error('Role not found');
      }

      return {
        id: role.id,
        name: role.name,
        key: role.key,
        description: role.description ?? undefined,
        isSystem: role.isSystem,
        permissions: role.permissions.map((p) => ({
          resource: p.resource as ResourceType,
          actions: p.actions as PermissionAction[],
          scope: p.scope as PermissionScope,
          fieldAccess: (p.fieldAccess as Record<string, boolean> | null) ?? undefined,
        })),
      };
    },

    updateRolePermissions: async (roleId: CUID, permissions: Permission[]): Promise<void> => {
      await db.$transaction([
        db.rolePermission.deleteMany({ where: { roleId } }),
        db.rolePermission.createMany({
          data: permissions.map((p) => ({
            roleId,
            resource: p.resource,
            actions: p.actions,
            scope: p.scope,
            fieldAccess: p.fieldAccess,
          })),
        }),
      ]);
    },

    updateRole: async (roleId: CUID, name: string, description: string | null): Promise<void> => {
      await db.role.update({
        where: { id: roleId },
        data: { name, description },
      });
    },

    deleteRole: async (roleId: CUID): Promise<void> => {
      // Check if it's a system role
      const role = await db.role.findUnique({ where: { id: roleId } });
      if (role?.isSystem) {
        throw new Error('Cannot delete system roles');
      }

      await db.role.delete({ where: { id: roleId } });
    },

    assignRoleToIdentity: async (identityId: CUID, roleId: CUID): Promise<void> => {
      await db.identityRole.create({
        data: { identityId, roleId },
      });
    },

    removeRoleFromIdentity: async (identityId: CUID, roleId: CUID): Promise<void> => {
      await db.identityRole.delete({
        where: {
          identityId_roleId: { identityId, roleId },
        },
      });
    },

    getIdentityRoleCounts: async (): Promise<Map<string, number>> => {
      const assignmentCounts = await db.identityRole.groupBy({
        by: ['roleId'],
        _count: { identityId: true },
      });

      return new Map(assignmentCounts.map((c) => [c.roleId, c._count.identityId]));
    },

    getRolesForIdentity: async (identityId: CUID): Promise<RoleDefinition[]> => {
      return permissionRepository(db).getRolesByIdentityId(identityId);
    },
  };
}
