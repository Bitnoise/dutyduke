import { type AccessRole } from '@/api/hris/authentication/model/types';

export type IdentityPayload = {
  roles: string[]; // Role keys (e.g., "OWNER", "office_manager")
};

export type IdentityWithRoles = {
  id: string;
  password: string;
  email: string;
  identityRole: {
    role?: AccessRole | { key: string }; // Legacy: AccessRole enum, or new: Role object with key
    roleId?: string;
  }[];
};

export class UserIdentityEntity {
  constructor(private databaseModel: IdentityWithRoles) {}

  getId() {
    return this.databaseModel.id;
  }

  getEmail() {
    return this.databaseModel.email;
  }

  getPayload(): IdentityPayload {
    // Support both old (enum) and new (key) formats during migration
    const roles = this.databaseModel.identityRole
      .map((ir) => {
        // New format: use role key from role object
        if (ir.role && typeof ir.role === 'object' && 'key' in ir.role) {
          return ir.role.key;
        }
        // Legacy format: convert enum to string
        if (ir.role && typeof ir.role === 'string') {
          return ir.role;
        }
        return null;
      })
      .filter((role): role is string => role !== null);

    return {
      roles,
    };
  }

  getPassword() {
    return this.databaseModel.password;
  }
}
