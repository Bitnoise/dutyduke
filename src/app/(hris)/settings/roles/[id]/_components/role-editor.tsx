'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Form, FormControl, Button, TextInput, TextArea } from '@/lib/ui';
import { type RoleDetailDto } from '@/api/hris/authorization/infrastructure/controllers/roles.controller';
import {
  type ResourceType,
  type PermissionAction,
  type PermissionScope,
  ResourceType as RT,
  PermissionAction as PA,
  PermissionScope as PS,
} from '@/api/hris/authorization/permissions';
import { HRIS_ROUTES } from '@/shared';
import { createRoleAction, updateRoleAction } from '../../_actions/role-actions';
import { PermissionMatrix } from './permission-matrix';

type Props = {
  initialRole?: RoleDetailDto;
};

// Resource display configuration
const RESOURCE_CONFIG: Record<
  ResourceType,
  {
    label: string;
    description: string;
    actions: PermissionAction[];
    supportsScope: boolean;
    hasFieldAccess?: boolean;
    fields?: string[];
  }
> = {
  [RT.EMPLOYEES]: {
    label: 'Employees',
    description: 'Manage employee data and profiles',
    actions: [PA.VIEW, PA.CREATE, PA.EDIT, PA.DELETE, PA.ASSIGN, PA.EXPORT],
    supportsScope: true,
    hasFieldAccess: true,
    fields: ['basicData', 'earnings', 'feedback'],
  },
  [RT.COMPANY_ABSENCES]: {
    label: 'Company Absences',
    description: 'Manage company-wide absences',
    actions: [PA.VIEW, PA.CREATE, PA.EDIT, PA.DELETE, PA.EXPORT],
    supportsScope: false,
  },
  [RT.COMPANY_DOCUMENTS]: {
    label: 'Company Documents',
    description: 'Manage company-wide documents',
    actions: [PA.VIEW, PA.CREATE, PA.EDIT, PA.DELETE],
    supportsScope: false,
  },
  [RT.COMPANY_EQUIPMENT]: {
    label: 'Equipment',
    description: 'Manage company equipment',
    actions: [PA.VIEW, PA.CREATE, PA.EDIT, PA.DELETE, PA.ASSIGN],
    supportsScope: false,
  },
  [RT.COMPANY_BENEFITS]: {
    label: 'Company Benefits',
    description: 'Manage company benefits',
    actions: [PA.VIEW, PA.CREATE, PA.EDIT, PA.DELETE, PA.ASSIGN],
    supportsScope: false,
  },
  [RT.COMPANY_SETTINGS]: {
    label: 'Company Settings',
    description: 'Manage company settings',
    actions: [PA.VIEW, PA.CREATE, PA.EDIT, PA.DELETE],
    supportsScope: false,
  },
  [RT.EMPLOYEE_PROFILE]: {
    label: 'Employee Profile',
    description: 'View and edit employee profile data',
    actions: [PA.VIEW, PA.EDIT],
    supportsScope: true,
    hasFieldAccess: true,
    fields: ['basicData', 'earnings'],
  },
  [RT.EMPLOYEE_DOCUMENTS]: {
    label: 'Employee Documents',
    description: 'Access employee documents',
    actions: [PA.VIEW, PA.CREATE, PA.DELETE],
    supportsScope: true,
  },
  [RT.EMPLOYEE_EQUIPMENT]: {
    label: 'Employee Equipment',
    description: 'Access employee equipment',
    actions: [PA.VIEW, PA.ASSIGN],
    supportsScope: true,
  },
  [RT.EMPLOYEE_ABSENCES]: {
    label: 'Employee Absences',
    description: 'Access employee absences',
    actions: [PA.VIEW, PA.CREATE, PA.EDIT, PA.DELETE],
    supportsScope: true,
  },
  [RT.EMPLOYEE_FEEDBACK]: {
    label: 'Employee Feedback',
    description: 'Access employee feedback',
    actions: [PA.VIEW, PA.CREATE, PA.EDIT],
    supportsScope: true,
  },
  [RT.EMPLOYEE_EARNINGS]: {
    label: 'Employee Earnings',
    description: 'Access employee earnings',
    actions: [PA.VIEW, PA.EDIT],
    supportsScope: true,
  },
};

export function RoleEditor({ initialRole }: Props): JSX.Element {
  const t = useTranslations('settings.roles');
  const router = useRouter();
  const isEditing = !!initialRole;
  const isSystemRole = initialRole?.isSystem ?? false;

  const [permissions, setPermissions] = useState(initialRole?.permissions ?? []);

  const handleSuccess = () => {
    router.push(HRIS_ROUTES.settings.roles);
  };

  const toggleAction = (resource: ResourceType, action: PermissionAction) => {
    if (isSystemRole) return; // Prevent toggling for system roles

    setPermissions((prev) => {
      const existing = prev.find((p) => p.resource === resource);

      if (!existing) {
        return [
          ...prev,
          {
            resource,
            actions: [action],
            scope: PS.ALL,
          },
        ];
      }

      const hasAction = existing.actions.includes(action);

      if (hasAction) {
        const newActions = existing.actions.filter((a) => a !== action);
        if (newActions.length === 0) {
          return prev.filter((p) => p.resource !== resource);
        }
        return prev.map((p) => (p.resource === resource ? { ...p, actions: newActions } : p));
      } else {
        return prev.map((p) => (p.resource === resource ? { ...p, actions: [...p.actions, action] } : p));
      }
    });
  };

  const toggleScope = (resource: ResourceType, scope: PermissionScope) => {
    if (isSystemRole) return; // Prevent toggling for system roles

    setPermissions((prev) => {
      const existing = prev.find((p) => p.resource === resource);
      if (!existing) return prev;

      return prev.map((p) => (p.resource === resource ? { ...p, scope } : p));
    });
  };

  const action = isEditing ? updateRoleAction : createRoleAction;

  return (
    <div className="flex flex-col gap-y-6">
      <Form
        action={action}
        className="flex flex-col gap-y-6"
        defaultState={{
          status: 'idle',
          form: {
            name: initialRole?.name ?? '',
            key: initialRole?.key ?? '',
            description: initialRole?.description ?? '',
            permissions: permissions,
            roleId: initialRole?.id ?? '',
          },
        }}
        onSuccess={handleSuccess}
      >
        {(form, errors) => (
          <>
            <div className="flex flex-col gap-y-4">
              <FormControl errors={errors as Record<string, string[] | undefined> | undefined} name="name">
                {(control) => (
                  <TextInput
                    isRequired
                    defaultValue={form.name}
                    label={t('forms.name')}
                    {...control}
                    isDisabled={isSystemRole}
                  />
                )}
              </FormControl>

              <FormControl errors={errors as Record<string, string[] | undefined> | undefined} name="key">
                {(control) => (
                  <TextInput
                    isRequired
                    defaultValue={form.key}
                    label={t('forms.key')}
                    {...control}
                    isDisabled={isSystemRole || isEditing}
                  />
                )}
              </FormControl>

              <FormControl
                errors={errors as Record<string, string[] | undefined> | undefined}
                name="description"
              >
                {(control) => (
                  <TextArea
                    defaultValue={form.description}
                    inputProps={{ rows: 3 }}
                    label={t('forms.description')}
                    {...control}
                    isDisabled={isSystemRole}
                  />
                )}
              </FormControl>
            </div>

            <div className="flex flex-col gap-y-4">
              <h2 className="text-lg font-semibold">{t('permissions')}</h2>
              <PermissionMatrix
                isSystemRole={isSystemRole}
                permissions={permissions}
                resourceConfig={RESOURCE_CONFIG}
                onToggleAction={toggleAction}
                onToggleScope={toggleScope}
              />
            </div>

            {/* Hidden inputs for form data */}
            <input name="permissions" type="hidden" value={JSON.stringify(permissions)} />
            {isEditing && initialRole && <input name="roleId" type="hidden" value={initialRole.id} />}

            <div className="flex items-end justify-end gap-x-4">
              <Button intent="tertiary" type="button" onClick={() => router.push(HRIS_ROUTES.settings.roles)}>
                {t('cancel')}
              </Button>
              <Button icon="ok" intent="primary" isDisabled={isSystemRole} type="submit">
                {t('save')}
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
}
