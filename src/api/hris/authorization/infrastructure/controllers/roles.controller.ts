import { ApiError } from '@/shared';
import { type CUID } from '@/shared';
import { type OrganizationContext } from '@/api/hris';
import { isOwnerRoute } from '../../authorization';
import { permissionRepository } from '../database/repositories/permissionRepository';
import { type Permission } from '../../permissions';

// DTOs
export type RoleListItemDto = {
  id: string;
  name: string;
  key: string;
  isSystem: boolean;
  assignedCount: number;
};

export type RoleDetailDto = {
  id: string;
  name: string;
  key: string;
  description?: string;
  isSystem: boolean;
  permissions: Permission[];
};

export type CreateRoleDto = {
  name: string;
  key: string;
  description?: string;
  permissions: Permission[];
};

export type UpdateRoleDto = {
  name?: string;
  description?: string;
  permissions?: Permission[];
};

export type RolesController = {
  getAllRoles: () => Promise<RoleListItemDto[]>;
  getRoleById: (roleId: CUID) => Promise<RoleDetailDto>;
  createRole: (data: CreateRoleDto) => Promise<RoleDetailDto>;
  updateRole: (roleId: CUID, data: UpdateRoleDto) => Promise<void>;
  deleteRole: (roleId: CUID) => Promise<void>;
  assignRoleToIdentity: (identityId: CUID, roleId: CUID) => Promise<void>;
  removeRoleFromIdentity: (identityId: CUID, roleId: CUID) => Promise<void>;
  getRolesForIdentity: (identityId: CUID) => Promise<RoleListItemDto[]>;
};

export function rolesController(organizationContext: OrganizationContext): RolesController {
  const permRepo = permissionRepository(organizationContext.db);

  const getAllRoles = isOwnerRoute(async () => {
    const roles = await permRepo.getAllRoles();
    const assignmentCounts = await permRepo.getIdentityRoleCounts();

    return roles.map(
      (role): RoleListItemDto => ({
        id: role.id,
        name: role.name,
        key: role.key,
        isSystem: role.isSystem,
        assignedCount: assignmentCounts.get(role.id) || 0,
      }),
    );
  });

  const getRoleById = isOwnerRoute(async (checker, roleId: CUID): Promise<RoleDetailDto> => {
    const role = await permRepo.getRoleById(roleId);

    if (!role) {
      throw new ApiError(404, 'Role not found');
    }

    return {
      id: role.id,
      name: role.name,
      key: role.key,
      description: role.description,
      isSystem: role.isSystem,
      permissions: role.permissions,
    };
  });

  const createRole = isOwnerRoute(async (checker, data: CreateRoleDto): Promise<RoleDetailDto> => {
    // Check if role key already exists
    const existingRole = await permRepo.getRoleByKey(data.key);
    if (existingRole) {
      throw new ApiError(409, 'Role with this key already exists');
    }

    const role = await permRepo.createRole(data.name, data.key, data.description || null, data.permissions);

    return {
      id: role.id,
      name: role.name,
      key: role.key,
      description: role.description,
      isSystem: role.isSystem,
      permissions: role.permissions,
    };
  });

  const updateRole = isOwnerRoute(async (checker, roleId: CUID, data: UpdateRoleDto): Promise<void> => {
    const role = await permRepo.getRoleById(roleId);

    if (!role) {
      throw new ApiError(404, 'Role not found');
    }

    if (role.isSystem) {
      throw new ApiError(400, 'Cannot modify system roles');
    }

    // Update name/description if provided
    if (data.name !== undefined || data.description !== undefined) {
      await permRepo.updateRole(roleId, data.name || role.name, data.description ?? null);
    }

    // Update permissions if provided
    if (data.permissions) {
      await permRepo.updateRolePermissions(roleId, data.permissions);
    }
  });

  const deleteRole = isOwnerRoute(async (checker, roleId: CUID): Promise<void> => {
    await permRepo.deleteRole(roleId);
  });

  const assignRoleToIdentity = isOwnerRoute(
    async (checker, identityId: CUID, roleId: CUID): Promise<void> => {
      await permRepo.assignRoleToIdentity(identityId, roleId);
    },
  );

  const removeRoleFromIdentity = isOwnerRoute(
    async (checker, identityId: CUID, roleId: CUID): Promise<void> => {
      await permRepo.removeRoleFromIdentity(identityId, roleId);
    },
  );

  const getRolesForIdentity = isOwnerRoute(async (checker, identityId: CUID): Promise<RoleListItemDto[]> => {
    const roles = await permRepo.getRolesForIdentity(identityId);
    const assignmentCounts = await permRepo.getIdentityRoleCounts();

    return roles.map(
      (role): RoleListItemDto => ({
        id: role.id,
        name: role.name,
        key: role.key,
        isSystem: role.isSystem,
        assignedCount: assignmentCounts.get(role.id) || 0,
      }),
    );
  });

  return {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    assignRoleToIdentity,
    removeRoleFromIdentity,
    getRolesForIdentity,
  };
}
