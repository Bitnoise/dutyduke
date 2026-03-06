'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { handleActionError, HRIS_ROUTES, type ActionReturnType } from '@/shared';
import { type CreateRoleDto } from '@/api/hris/authorization/infrastructure/controllers/roles.controller';
import { logger } from '@/shared/service/pino';

type RoleForm = CreateRoleDto & { roleId?: string };

type CreateRoleForm = RoleForm;
type UpdateRoleForm = RoleForm & { roleId: string };

type CreateRoleState = ActionReturnType<CreateRoleForm, undefined, Record<string, string[] | undefined>>;
type UpdateRoleState = ActionReturnType<UpdateRoleForm, undefined, Record<string, string[] | undefined>>;

export async function createRoleAction(
  prevState: CreateRoleState,
  formData: FormData,
): Promise<CreateRoleState> {
  const form: CreateRoleForm = {
    name: formData.get('name') as string,
    key: formData.get('key') as string,
    description: formData.get('description') as string | undefined,
    permissions: JSON.parse(formData.get('permissions') as string),
  };

  try {
    const api = hrisApi;
    await api.authorization.roles.createRole(form);
  } catch (err) {
    logger.info(err);
    return { ...prevState, ...handleActionError(err), form };
  }

  revalidatePath(HRIS_ROUTES.settings.roles);

  return {
    ...prevState,
    status: 'success',
    form,
    data: undefined,
  };
}

export async function updateRoleAction(
  prevState: UpdateRoleState,
  formData: FormData,
): Promise<UpdateRoleState> {
  const form: UpdateRoleForm = {
    roleId: formData.get('roleId') as string,
    name: formData.get('name') as string,
    key: formData.get('key') as string,
    description: formData.get('description') as string | undefined,
    permissions: JSON.parse(formData.get('permissions') as string),
  };

  try {
    const api = hrisApi;

    // Check if role is a system role before attempting update
    const role = await api.authorization.roles.getRoleById(form.roleId);
    if (role.isSystem) {
      return {
        ...prevState,
        status: 'error',
        form,
        error: 'Cannot modify system roles',
      };
    }

    await api.authorization.roles.updateRole(form.roleId, {
      name: form.name,
      description: form.description,
      permissions: form.permissions,
    });
  } catch (err) {
    logger.info(err);
    return { ...prevState, ...handleActionError(err), form };
  }

  revalidatePath(HRIS_ROUTES.settings.roles);

  return {
    ...prevState,
    status: 'success',
    form,
    data: undefined,
  };
}

type DeleteRoleForm = {
  roleId: string;
};

type DeleteRoleState = ActionReturnType<DeleteRoleForm, undefined, Record<string, string[] | undefined>>;

export async function deleteRoleAction(
  prevState: DeleteRoleState,
  formData: FormData,
): Promise<DeleteRoleState> {
  const form: DeleteRoleForm = {
    roleId: formData.get('roleId') as string,
  };

  try {
    const api = hrisApi;
    await api.authorization.roles.deleteRole(form.roleId);
  } catch (err) {
    logger.info(err);
    return { ...prevState, ...handleActionError(err), form };
  }

  revalidatePath(HRIS_ROUTES.settings.roles);

  return {
    ...prevState,
    status: 'success',
    form,
    data: undefined,
  };
}
