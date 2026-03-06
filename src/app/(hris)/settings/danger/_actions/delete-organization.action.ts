'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { hrisApi } from '@/api/hris';
import { type ActionReturnType, AUTH_ROUTES, ERROR_MESSAGES } from '@/shared';
import { getEnv } from '@/shared/utils/get-env';
import { logger } from '@/shared/service/pino';

export async function deleteOrganization(
  _prevState: ActionReturnType<undefined, undefined, never>,
): Promise<ActionReturnType<undefined, undefined, never>> {
  try {
    const api = hrisApi;
    await api.settings.deleteOrganization();
  } catch (err) {
    logger.info(err);
    return { status: 'error', form: undefined, error: ERROR_MESSAGES.DELETE_ORGANIZATION_FAILED };
  }

  (await cookies()).delete('Authorization');
  redirect(`${getEnv('NEXT_PUBLIC_APP_URL')}${AUTH_ROUTES.signUp}`);
}
