import { type CUID } from '@/api/hris/types';

export type AuthenticationRepository = {
  signToken: (identityId: CUID, payload: unknown) => Promise<string>;
  hashPassword: (password: string) => Promise<string>;
  verifyPassword: (password: string, hash: string) => Promise<boolean>;
};
