import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { type CUID } from '@/api/hris/types';
import { type RolesRepository } from '@/api/hris/authentication/model/repository/roles-repository.type';
import { ApiError } from '@/shared';

export function rolesRepository(db: OrganizationPrismaClient): RolesRepository {
  return {
    addRoleByKey: async (identityId: CUID, roleKey: string): Promise<void> => {
      // Find role by key
      const role = await db.role.findUnique({
        where: { key: roleKey },
      });

      if (!role) {
        throw new ApiError(404, `Role with key "${roleKey}" not found`);
      }

      // Check if identity already has this role
      const existingRole = await db.identityRole.findUnique({
        where: {
          identityId_roleId: {
            identityId,
            roleId: role.id,
          },
        },
      });

      if (existingRole) {
        return; // Role already assigned
      }

      await db.identityRole.create({
        data: {
          identityId,
          roleId: role.id,
        },
      });
    },
  };
}
