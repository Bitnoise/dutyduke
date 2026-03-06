import * as jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { CUID } from '@/api/hris/types';
import { ApiError, ERROR_MESSAGES } from '@/shared';
import { getEnv } from '@/shared/utils/get-env';
import { logger } from '@/shared/service/pino';

export type AuthenticatedIdentity = {
  id: CUID;
  roles: string[]; // Role keys
};

export async function authenticateToken(token: string) {
  try {
    const secret = getEnv('JWT_SECRET', { required: true });
    const verifiedToken = jwt.verify(token, secret) as {
      sub: CUID;
      payload: { roles: string[] }; // Role keys
    };

    return <AuthenticatedIdentity>{
      id: verifiedToken.sub,
      roles: verifiedToken.payload.roles,
    };
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw new ApiError(error.status, error.message);
    }

    if (error instanceof Error) {
      logger.warn(`Unauthorized token: ${error.message}`, error);
    }

    (await cookies()).delete('Authorization');

    throw new ApiError(401, ERROR_MESSAGES.UNAUTHORIZED);
  }
}
