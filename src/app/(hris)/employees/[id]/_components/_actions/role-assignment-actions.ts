'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { handleActionError, HRIS_ROUTES, type ActionReturnType } from '@/shared';
import { logger } from '@/shared/service/pino';

type RoleAssignmentForm = {
  identityId: string;
  roleId: string;
};

type RoleAssignmentState = ActionReturnType<
  RoleAssignmentForm,
  undefined,
  Record<string, string[] | undefined>
>;

export async function assignRoleAction(
  prevState: RoleAssignmentState,
  formData: FormData,
): Promise<RoleAssignmentState> {
  const form: RoleAssignmentForm = {
    identityId: formData.get('identityId') as string,
    roleId: formData.get('roleId') as string,
  };

  try {
    const api = hrisApi;
    await api.authorization.roles.assignRoleToIdentity(form.identityId, form.roleId);
  } catch (err) {
    logger.info(err);
    return { ...prevState, ...handleActionError(err), form };
  }

  revalidatePath(HRIS_ROUTES.employees.base);

  return {
    ...prevState,
    status: 'success',
    form,
    data: undefined,
  };
}

export async function removeRoleAction(
  prevState: RoleAssignmentState,
  formData: FormData,
): Promise<RoleAssignmentState> {
  const form: RoleAssignmentForm = {
    identityId: formData.get('identityId') as string,
    roleId: formData.get('roleId') as string,
  };

  try {
    const api = hrisApi;
    await api.authorization.roles.removeRoleFromIdentity(form.identityId, form.roleId);
  } catch (err) {
    logger.info(err);
    return { ...prevState, ...handleActionError(err), form };
  }

  revalidatePath(HRIS_ROUTES.employees.base);

  return {
    ...prevState,
    status: 'success',
    form,
    data: undefined,
  };
}
