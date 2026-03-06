'use client';

import {
  type ResourceType,
  type PermissionAction,
  type PermissionScope,
  PermissionScope as PS,
} from '@/api/hris/authorization/permissions';

type Permission = {
  resource: ResourceType;
  actions: PermissionAction[];
  scope: PermissionScope;
  fieldAccess?: Record<string, boolean>;
};

type ResourceConfig = {
  label: string;
  description: string;
  actions: PermissionAction[];
  supportsScope: boolean;
  hasFieldAccess?: boolean;
  fields?: string[];
};

type Props = {
  permissions: Permission[];
  resourceConfig: Record<ResourceType, ResourceConfig>;
  onToggleAction: (resource: ResourceType, action: PermissionAction) => void;
  onToggleScope: (resource: ResourceType, scope: PermissionScope) => void;
  isSystemRole: boolean;
};

export function PermissionMatrix({
  permissions,
  resourceConfig,
  onToggleAction,
  onToggleScope,
  isSystemRole,
}: Props): JSX.Element {
  return (
    <div className="flex flex-col gap-y-4">
      {Object.entries(resourceConfig).map(([resource, config]) => {
        const resourceType = resource as ResourceType;
        const permission = permissions.find((p) => p.resource === resourceType);
        const hasPermission = !!permission;

        return (
          <div key={resource} className="rounded-lg border p-4">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-medium">{config.label}</h3>
                <p className="text-text-light-body text-sm">{config.description}</p>
              </div>
            </div>

            {/* Scope selector (if resource supports it) */}
            {config.supportsScope && (
              <div className="mb-4 space-y-2">
                <p className="text-sm font-medium">
                  Scope:
                  {!hasPermission && (
                    <span className="text-text-light-body ml-2 text-xs italic">(Select an action first)</span>
                  )}
                </p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      checked={hasPermission && permission.scope === PS.ALL}
                      disabled={isSystemRole || !hasPermission}
                      name={`scope-${resource}`}
                      type="radio"
                      onChange={() => onToggleScope(resourceType, PS.ALL)}
                    />
                    <span className={`text-sm ${!hasPermission ? 'text-text-light-body' : ''}`}>
                      All (company-wide access)
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      checked={hasPermission && permission.scope === PS.SELF}
                      disabled={isSystemRole || !hasPermission}
                      name={`scope-${resource}`}
                      type="radio"
                      onChange={() => onToggleScope(resourceType, PS.SELF)}
                    />
                    <span className={`text-sm ${!hasPermission ? 'text-text-light-body' : ''}`}>
                      Self (own data only)
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Actions checkboxes */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Actions:</p>
              <div className="flex flex-wrap gap-4">
                {config.actions.map((action) => (
                  <label key={action} className="flex items-center gap-2">
                    <input
                      checked={permission?.actions.includes(action) || false}
                      disabled={isSystemRole}
                      type="checkbox"
                      onChange={() => onToggleAction(resourceType, action)}
                    />
                    <span className="text-sm">{action}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
