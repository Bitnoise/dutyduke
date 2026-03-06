import { type CUID } from '@/api/hris/types';

export type RolesRepository = {
  addRoleByKey: (identityId: CUID, roleKey: string) => Promise<void>;
};
