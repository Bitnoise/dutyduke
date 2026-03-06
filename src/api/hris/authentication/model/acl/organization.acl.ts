import { type WithId, type CUID } from '@/shared';

export type OrganizationUserDto = WithId<{
  email: string;
}>;

export type OrganizationAcl = {
  addUser: (email: string) => Promise<void>;
  deleteUser: (userId: CUID) => Promise<void>;
  getUserByEmail: (email: string) => Promise<OrganizationUserDto | null>;
};
