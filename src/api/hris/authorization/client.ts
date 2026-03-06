// Client-safe permission utilities
// This file can be imported by client components

export type { SerializedPermissions } from './permissionChecker';
export { canAccess } from './permissionChecker';

// Re-export enums that are safe for client-side use
export { ResourceType, PermissionAction, PermissionScope } from './permissions';
export type {
  ResourceType as ResourceTypeType,
  PermissionAction as PermissionActionType,
} from './permissions';
