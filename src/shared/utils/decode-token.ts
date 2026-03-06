import * as jwt from 'jsonwebtoken';
import type { CUID } from '@/api/hris/types';
import { type AccessRole } from '@/api/hris/authentication/model/types';

export type AuthenticatedIdentity = {
  id: CUID;
  roles: AccessRole[];
};

export function decodeToken(token: string) {
  const decoded = jwt.decode(token) as {
    sub: CUID;
    payload: { roles: AccessRole[] };
  };

  return <AuthenticatedIdentity>{
    id: <CUID>decoded.sub,
    roles: decoded.payload.roles as AccessRole[],
  };
}
