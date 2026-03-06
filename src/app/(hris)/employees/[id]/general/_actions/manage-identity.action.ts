'use server';

import { z } from 'zod';
import { hrisApi } from '@/api/hris';
import { type CUID, handleActionError, type ActionReturnType } from '@/shared';
import { type RoleListItemDto } from '@/api/hris/authorization/infrastructure/controllers/roles.controller';
import {
  createIdentitySchema,
  type CreateIdentityForm,
  type UpdateIdentityForm,
} from '../_schemas/application-access.schema';

type CreateIdentityState = ActionReturnType<
  CreateIdentityForm,
  undefined,
  Record<string, string[] | undefined>
>;
type UpdateIdentityState = ActionReturnType<
  UpdateIdentityForm,
  undefined,
  Record<string, string[] | undefined>
>;

// Helper to convert role ID to key (handles both ID and key inputs)
async function getRoleKey(
  roleIdOrKey: string | undefined,
  allRoles: RoleListItemDto[],
): Promise<string | undefined> {
  if (!roleIdOrKey) return undefined;

  const roleByKey = allRoles.find((r) => r.key === roleIdOrKey);
  if (roleByKey) return roleByKey.key;

  const roleById = allRoles.find((r) => r.id === roleIdOrKey);
  return roleById?.key;
}

// Helper to update employee status to ACTIVE if needed (when identity is created)
async function updateEmployeeStatusIfNeeded(api: typeof hrisApi, employeeId: CUID): Promise<void> {
  const employee = await api.employees.getEmployeeById(employeeId);
  if (employee && employee.status === 'ARCHIVED') {
    await api.employees.updateEmployeeStatus(employeeId, 'ACTIVE');
  }
}

export async function createIdentityAction(
  prevState: CreateIdentityState,
  formData: FormData,
): Promise<CreateIdentityState> {
  const sendNotification =
    formData.get('sendNotification') === 'true' || formData.get('saveAndNotify') !== null;
  const rawRoleKey = formData.get('roleKey') as string;
  const form: CreateIdentityForm = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
    roleKey: rawRoleKey && rawRoleKey.trim() !== '' ? rawRoleKey : '',
  };

  // If sending notification, validate and create identity with email invitation
  if (sendNotification) {
    const validation = createIdentitySchema.safeParse(form);
    if (!validation.success) {
      return {
        ...prevState,
        form,
        status: 'validation-error',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    try {
      const api = hrisApi;
      const employeeId = formData.get('employeeId') as CUID;

      const allRoles = await api.authorization.roles.getAllRoles();
      const roleKey = await getRoleKey(validation.data.roleKey, allRoles);

      const identityId = await api.auth.createIdentity(validation.data.email, roleKey);

      await updateEmployeeStatusIfNeeded(api, employeeId);
      await api.employees.updateEmployeeGeneralInfo(employeeId, { identityId });

      return {
        ...prevState,
        status: 'success',
        form,
        data: undefined,
      };
    } catch (err) {
      return { ...prevState, form, ...handleActionError(err) };
    }
  }

  // Manual creation with password
  const validation = createIdentitySchema.safeParse(form);
  if (!validation.success) {
    return {
      ...prevState,
      form,
      status: 'validation-error',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const api = hrisApi;
    const employeeId = formData.get('employeeId') as CUID;

    const employee = await api.employees.getEmployeeById(employeeId);
    if (employee.identityId) {
      return {
        ...prevState,
        form,
        status: 'error',
        error: 'Employee already has an identity. Please refresh the page and use the edit form.',
      };
    }

    const allRoles = await api.authorization.roles.getAllRoles();
    const roleKey = await getRoleKey(validation.data.roleKey, allRoles);

    const identityId = await api.auth.createIdentityManually(
      validation.data.email,
      validation.data.password,
      roleKey,
    );

    await updateEmployeeStatusIfNeeded(api, employeeId);
    await api.employees.updateEmployeeGeneralInfo(employeeId, { identityId });

    return {
      ...prevState,
      status: 'success',
      form,
      data: undefined,
    };
  } catch (err) {
    return { ...prevState, form, ...handleActionError(err) };
  }
}

export async function updateIdentityAction(
  prevState: UpdateIdentityState,
  formData: FormData,
): Promise<UpdateIdentityState> {
  const rawRoleKey = formData.get('roleKey') as string;
  const form: UpdateIdentityForm = {
    email: (formData.get('email') as string) || undefined,
    password: (formData.get('password') as string) || undefined,
    confirmPassword: (formData.get('confirmPassword') as string) || undefined,
    roleKey: rawRoleKey && rawRoleKey.trim() !== '' ? rawRoleKey : undefined,
  };

  // Only validate if password fields are provided
  if (form.password || form.confirmPassword) {
    const passwordValidation = z
      .object({
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
      .safeParse({ password: form.password || '', confirmPassword: form.confirmPassword || '' });

    if (!passwordValidation.success) {
      return {
        ...prevState,
        form,
        status: 'validation-error',
        errors: passwordValidation.error.flatten().fieldErrors,
      };
    }
  }

  if (form.email) {
    const emailValidation = z.string().email().safeParse(form.email);
    if (!emailValidation.success) {
      return {
        ...prevState,
        form,
        status: 'validation-error',
        errors: { email: ['Invalid email'] },
      };
    }
  }

  try {
    const api = hrisApi;
    const identityId = formData.get('identityId') as CUID;

    // Get current identity to compare email
    const currentIdentity = await api.auth.getIdentityById(identityId);
    if (!currentIdentity) {
      return { ...prevState, ...handleActionError(new Error('Identity not found')) };
    }

    const updates: { email?: string; password?: string } = {};

    // Only update email if it's provided and different from current email
    if (form.email && form.email.trim() !== '' && form.email !== currentIdentity.email) {
      updates.email = form.email;
    }

    // Only update password if provided (it's already generated if user clicked generate button)
    if (form.password && form.password.trim() !== '') {
      updates.password = form.password;
    }

    if (Object.keys(updates).length > 0) {
      await api.auth.updateIdentity(identityId, updates);
    }

    // Handle role update if provided
    if (form.roleKey) {
      const currentRoles = await api.authorization.roles.getRolesForIdentity(identityId);
      const allRoles = await api.authorization.roles.getAllRoles();
      const roleKey = await getRoleKey(form.roleKey, allRoles);
      const roleToAssign = allRoles.find((r) => r.key === roleKey);

      if (roleToAssign) {
        const isAlreadyAssigned = currentRoles.some((r) => r.id === roleToAssign.id);

        if (!isAlreadyAssigned) {
          // Remove all non-system roles and add the new one
          for (const role of currentRoles) {
            if (!role.isSystem) {
              await api.authorization.roles.removeRoleFromIdentity(identityId, role.id);
            }
          }
          await api.authorization.roles.assignRoleToIdentity(identityId, roleToAssign.id);
        }
      }
    }

    return {
      ...prevState,
      status: 'success',
      form,
      data: undefined,
    };
  } catch (err) {
    return { ...prevState, form, ...handleActionError(err) };
  }
}

export async function deleteIdentityAction(identityId: CUID, employeeId: CUID) {
  try {
    const api = hrisApi;

    await api.auth.deleteIdentity(identityId);
    await api.employees.updateEmployeeGeneralInfo(employeeId, { identityId: null });

    return {
      status: 'success' as const,
    };
  } catch (err) {
    return { ...handleActionError(err) };
  }
}
