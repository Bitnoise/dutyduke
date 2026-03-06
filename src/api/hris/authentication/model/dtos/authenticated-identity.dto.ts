import { type AccessRole } from '@/api/hris/authentication/model/types';
import { type CUID } from '@/api/hris/types';

export type AuthenticatedIdentity = {
  id: CUID;
  roles: AccessRole[];
};
