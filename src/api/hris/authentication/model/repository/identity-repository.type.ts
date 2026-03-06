import { type IdentityDto } from '@/api/hris/authentication/model/dtos/identity.dto';
import { type CUID } from '@/api/hris/types';
import { type UserIdentityEntity } from '@/api/hris/authentication/model/entities';

export type IdentityRepository = {
  createIdentity: (identityDto: IdentityDto) => Promise<CUID>;
  addOrganizationAdmin(adminId: CUID, identityId: CUID): Promise<void>;
  findIdentityByEmail(email: string): Promise<UserIdentityEntity | null>;
  getIdentityById(id: CUID): Promise<UserIdentityEntity | null>;
  deleteIdentity(id: CUID, isAdmin: boolean): Promise<void>;
  updateIdentityEmail: (id: CUID, email: string) => Promise<void>;
  updateIdentityPassword: (id: CUID, password: string) => Promise<void>;
};
