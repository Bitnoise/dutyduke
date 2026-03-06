# ADR: Role-Based Access Control (RBAC) Architecture

## Status
Implemented

## Date
2026-01-07

## Context and Problem Statement

DutyDuke HRIS system requires granular access control to manage different levels of permissions across various resources (employees, documents, equipment, absences, etc.). The system needs to support:

- Multiple user roles with different permission levels
- Company-wide vs. self-only access scopes
- Action-level permissions (VIEW, CREATE, EDIT, DELETE, ASSIGN, EXPORT)
- Flexible role assignment to users
- System roles (OWNER) with immutable permissions
- Custom roles that can be created and managed by administrators

The previous implementation used a simple enum-based role system (OWNER, EMPLOYEE) which was too rigid and couldn't support custom roles or granular permissions.

## Decision Outcome

Implemented a comprehensive RBAC system with the following key components:

### 1. Database Schema

The RBAC system uses four main database tables:

#### `Role`
- Stores role definitions (both system and custom roles)
- Fields:
  - `id`: Unique identifier (CUID)
  - `name`: Display name (e.g., "Office Manager")
  - `key`: Unique key for code reference (e.g., "office_manager", "OWNER")
  - `description`: Optional description
  - `isSystem`: Boolean flag (true only for OWNER role, prevents modification/deletion)
  - `createdAt`, `updatedAt`: Timestamps

#### `RolePermission`
- Defines granular permissions for each role
- Fields:
  - `id`: Unique identifier
  - `roleId`: Foreign key to Role
  - `resource`: ResourceType enum (which resource this permission applies to)
  - `actions`: Array of PermissionAction enum values
  - `scope`: PermissionScope enum (ALL or SELF)
  - `fieldAccess`: JSON object for field-level permissions (future extension)
- Unique constraint on `(roleId, resource)` - one permission record per role per resource

#### `IdentityRole`
- Junction table linking identities to roles (many-to-many)
- Fields:
  - `identityId`: Foreign key to Identity
  - `roleId`: Foreign key to Role
- Composite primary key on `(identityId, roleId)`
- Cascade deletes when identity or role is deleted

#### `Identity`
- Existing table, unchanged
- Represents user authentication credentials

### 2. Permission Type System

#### ResourceType Enum
Defines all resources in the system:

**Company-Level Resources** (no SELF scope):
- `COMPANY_ABSENCES`: Company-wide absence policies and tracking
- `COMPANY_DOCUMENTS`: Shared company documentation
- `COMPANY_EQUIPMENT`: Company equipment inventory
- `COMPANY_BENEFITS`: Company benefits programs
- `COMPANY_SETTINGS`: System-wide settings

**Employee Management** (supports ALL/SELF scope):
- `EMPLOYEES`: Employee records and profiles

**Employee-Specific Resources** (supports ALL/SELF scope):
- `EMPLOYEE_PROFILE`: Individual employee profile data
- `EMPLOYEE_DOCUMENTS`: Employee personal documents
- `EMPLOYEE_EQUIPMENT`: Equipment assigned to employees
- `EMPLOYEE_ABSENCES`: Employee absence requests
- `EMPLOYEE_FEEDBACK`: Performance feedback and reviews
- `EMPLOYEE_EARNINGS`: Salary and compensation data

#### PermissionAction Enum
Defines actions that can be performed:
- `VIEW`: Read access to resource data
- `CREATE`: Create new resource instances
- `EDIT`: Modify existing resources
- `DELETE`: Remove resources
- `ASSIGN`: Assign resources to entities (equipment to employees, roles to users)
- `EXPORT`: Export resource data

#### PermissionScope Enum
Defines the scope of access:
- `ALL`: Company-wide access to all data within the resource
- `SELF`: Access only to own data (requires employee record linked to identity)

### 3. API-Level Implementation

The API layer implements RBAC through several key components:

#### Permission Checker (`permissionChecker.ts`)

Core permission checking logic:

```typescript
type PermissionChecker = {
  can: (resource: ResourceType, action: PermissionAction) => boolean;
  canAny: (resource: ResourceType, actions: PermissionAction[]) => boolean;
  canAll: (resource: ResourceType, actions: PermissionAction[]) => boolean;
  getScope: (resource: ResourceType) => PermissionScope | null;
  getFieldAccess: (resource: ResourceType) => Record<string, boolean> | boolean;
  isOwner: () => boolean;
  getRoles: () => RoleDefinition[];
  getIdentityId: () => CUID;
  serialize: () => SerializedPermissions;
};
```

**Key Features:**
- Aggregates permissions from all assigned roles (union of permissions)
- Scope priority: `ALL` takes precedence over `SELF` if user has multiple roles
- OWNER role bypasses all checks (returns `true` for all permissions)
- Field-level access support (currently unused, reserved for future)
- Serialization support for client-side components

#### Authorization Wrappers (`authorization.ts`)

Located at `src/api/hris/authorization/authorization.ts:69-141`

Three main authorization patterns:

**1. `requirePermission<TArgs, TReturn>(resource, action, callback)`**
- Checks specific resource + action permission
- Throws 403 error if permission denied
- Passes PermissionChecker to callback
- Used for protected API endpoints

**2. `privateRoute<TArgs, TReturn>(callback)`**
- Verifies user authentication only
- No specific permission check
- Used for endpoints that need authentication but handle their own authorization logic

**3. `isOwnerRoute<TArgs, TReturn>(callback)`**
- Requires OWNER role
- Used for administrative operations (role management, system settings)
- Returns 403 if not owner

#### Scope Enforcement in Controllers

Example from `employees-earnings.controller.ts:39-47`:

```typescript
const updateEmployeeEarnings = async (
  checker: PermissionChecker,
  employeeId: CUID,
  earnings: EmployeeEarningsSchema
) => {
  const scope = checker.getScope(ResourceType.EMPLOYEE_EARNINGS);
  if (scope === PermissionScope.SELF) {
    const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(
      checker.getIdentityId()
    );
    if (!currentEmployee || currentEmployee.id !== employeeId) {
      throw new ApiError(403, 'Forbidden: Can only manage own earnings');
    }
  }
  // ... proceed with operation
};
```

**Scope Checking Pattern:**
1. Get scope for the resource via `checker.getScope(resource)`
2. If scope is `SELF`, verify that the target employee matches the logged-in user
3. Throw 403 error if scope violation
4. Proceed with operation if authorized

This pattern is implemented in:
- `src/api/hris/employees/infrastructure/controllers/employees-earnings.controller.ts`
- `src/api/hris/employees/infrastructure/controllers/employees-documents.controller.ts`
- `src/api/hris/employees/infrastructure/controllers/employee-equipment.controller.ts`

#### Permission Repository (`permissionRepository.ts`)

Database access layer for RBAC operations:

**Key Methods:**
- `getRolesByIdentityId(identityId)`: Fetch all roles for a user with permissions
- `getRoleByKey(key)`: Fetch specific role by key (e.g., "OWNER")
- `getAllRoles()`: List all roles (system + custom)
- `createRole(name, key, description, permissions)`: Create custom role
- `updateRolePermissions(roleId, permissions)`: Update role permissions
- `deleteRole(roleId)`: Delete custom role (prevents deleting system roles)
- `assignRoleToIdentity(identityId, roleId)`: Assign role to user
- `removeRoleFromIdentity(identityId, roleId)`: Remove role from user

**Protection Mechanisms:**
- Prevents deletion of system roles (`isSystem === true`)
- Uses transactions for atomic permission updates
- Cascade deletes for role assignments

### 4. UI-Level Implementation

The UI implements RBAC through both server and client components:

#### Server Components

**Permission Checker Usage:**
```typescript
import { getPermissionChecker } from '@/api/hris/authorization';

export default async function EmployeesPage() {
  const checker = await getPermissionChecker();

  // Check permissions
  const canCreateEmployee = checker.can(ResourceType.EMPLOYEES, PermissionAction.CREATE);
  const canExport = checker.can(ResourceType.EMPLOYEES, PermissionAction.EXPORT);

  // Get serialized permissions for client components
  const permissions = checker.serialize();

  return <EmployeesTable permissions={permissions} />;
}
```

#### Client Components

**Serialized Permissions:**
```typescript
'use client';
import { canAccess, type SerializedPermissions } from '@/api/hris/authorization/client';

function EmployeeActions({ permissions }: { permissions: SerializedPermissions }) {
  const canEdit = canAccess(permissions, ResourceType.EMPLOYEES, PermissionAction.EDIT);

  return (
    <>
      {canEdit && <EditButton />}
    </>
  );
}
```

**Module Separation:**
- `@/api/hris/authorization` - Server-only exports (includes database access)
- `@/api/hris/authorization/client` - Client-safe exports (enums, types, helper functions)

#### Role Management UI

Located at `src/app/(hris)/settings/roles/`

**Permission Matrix Component** (`permission-matrix.tsx`):
- Visual editor for role permissions
- Displays all resources with available actions
- Scope selector (ALL vs SELF) for resources that support it
- Checkboxes for action selection
- Disables editing for system roles

**Role Editor** (`role-editor.tsx`):
- Form for creating/editing roles
- Fields: name, key (unique identifier), description
- Embedded permission matrix
- Prevents editing system role properties
- JSON serialization of permissions for form submission

**Role Assignment** (`role-assignment.tsx`):
- Component for assigning roles to employees
- Located in employee profile: `src/app/(hris)/employees/[id]/_components/`
- Shows assigned roles (with ability to remove non-system roles)
- Combo box to add new roles
- Real-time updates via server actions

#### Application Access Form

Located at `src/app/(hris)/employees/[id]/general/_forms/application-access-form.tsx`

Features:
- Create identity with role assignment
- Update identity email/password and role
- Send invitation emails
- Revoke access (delete identity)
- Shows system role badge
- Prevents manual editing of system roles

### 5. Middleware Integration

Located at `src/middleware.ts:9-92`

**Route Protection:**
- Basic permission checks for route access
- Extracts role from JWT token
- OWNER-only route protection (settings, equipment management)
- Route-to-permission mapping for common paths
- Full permission checking deferred to controllers (middleware is first gate only)

**Design Decision:** Middleware performs lightweight checks (authentication + basic role checks), while controllers perform comprehensive permission + scope checks. This reduces middleware complexity and allows for dynamic permission evaluation.

## Permission Matrix

### Resource-Action-Scope Combinations

Below is the comprehensive permission matrix showing which actions and scopes are supported for each resource type:

| Resource Type | VIEW | CREATE | EDIT | DELETE | ASSIGN | EXPORT | Supports Scope |
|--------------|------|--------|------|--------|--------|--------|----------------|
| **EMPLOYEES** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ ALL/SELF |
| **COMPANY_ABSENCES** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ (ALL only) |
| **COMPANY_DOCUMENTS** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ (ALL only) |
| **COMPANY_EQUIPMENT** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ (ALL only) |
| **COMPANY_BENEFITS** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ (ALL only) |
| **COMPANY_SETTINGS** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ (ALL only) |
| **EMPLOYEE_PROFILE** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ ALL/SELF |
| **EMPLOYEE_DOCUMENTS** | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ ALL/SELF |
| **EMPLOYEE_EQUIPMENT** | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ ALL/SELF |
| **EMPLOYEE_ABSENCES** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ ALL/SELF |
| **EMPLOYEE_FEEDBACK** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ ALL/SELF |
| **EMPLOYEE_EARNINGS** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ ALL/SELF |

### Common Permission Combinations (Role Examples)

#### OWNER (System Role)
- All resources: All actions, ALL scope
- Cannot be modified or deleted
- Bypasses all permission checks in code

#### HR Manager (Hypothetical Custom Role)
- EMPLOYEES: VIEW, CREATE, EDIT, EXPORT (ALL scope)
- EMPLOYEE_ABSENCES: VIEW, CREATE, EDIT, DELETE (ALL scope)
- EMPLOYEE_DOCUMENTS: VIEW, CREATE, DELETE (ALL scope)
- COMPANY_BENEFITS: VIEW, ASSIGN (ALL scope)
- COMPANY_ABSENCES: VIEW, CREATE, EDIT (ALL scope)

#### Department Manager (Hypothetical Custom Role)
- EMPLOYEES: VIEW (ALL scope)
- EMPLOYEE_ABSENCES: VIEW, CREATE, EDIT (SELF scope - can approve team absences if additional logic added)
- EMPLOYEE_FEEDBACK: VIEW, CREATE, EDIT (ALL scope)
- EMPLOYEE_DOCUMENTS: VIEW (ALL scope)

#### Employee (Self-Service, Hypothetical Custom Role)
- EMPLOYEE_PROFILE: VIEW, EDIT (SELF scope)
- EMPLOYEE_DOCUMENTS: VIEW (SELF scope)
- EMPLOYEE_ABSENCES: VIEW, CREATE (SELF scope)
- EMPLOYEE_EQUIPMENT: VIEW (SELF scope)

### Scope Behavior Matrix

| Resource | Scope = ALL | Scope = SELF | Scope Check Logic |
|----------|-------------|--------------|-------------------|
| EMPLOYEES | Access all employee records | Access only own employee record | `employeeId === currentEmployee.id` |
| EMPLOYEE_PROFILE | Edit any employee profile | Edit own profile only | `employeeId === currentEmployee.id` |
| EMPLOYEE_DOCUMENTS | View/manage all employee docs | View/manage own documents only | `employeeId === currentEmployee.id` |
| EMPLOYEE_EQUIPMENT | View/assign any employee equipment | View own equipment only | `employeeId === currentEmployee.id` |
| EMPLOYEE_ABSENCES | Manage all employee absences | Manage own absences only | `employeeId === currentEmployee.id` |
| EMPLOYEE_FEEDBACK | View/create feedback for anyone | View/create own feedback only | `employeeId === currentEmployee.id` |
| EMPLOYEE_EARNINGS | View/edit all employee earnings | View/edit own earnings only | `employeeId === currentEmployee.id` |
| COMPANY_* | Company-wide access | N/A (not supported) | Scope check skipped |

## Security Review and Recommendations

### Current Security Strengths

1. **Defense in Depth:**
   - Middleware provides first-level route protection
   - Controllers enforce permission + action checks
   - Scope enforcement adds additional layer for employee resources
   - JWT-based authentication with role claims

2. **Database Security:**
   - Cascade deletes prevent orphaned records
   - System role protection (`isSystem` flag)
   - Unique constraints on role keys
   - Composite primary keys for many-to-many relationships

3. **Type Safety:**
   - TypeScript enums for resources, actions, and scopes
   - Compile-time type checking
   - Consistent type definitions across client/server

4. **Separation of Concerns:**
   - Clear separation between client and server authorization code
   - Repository pattern isolates database access
   - Controller pattern centralizes authorization logic

5. **Immutable System Roles:**
   - OWNER role cannot be deleted or modified
   - Prevents accidental privilege escalation

## Consequences

### Positive

1. **Flexibility:** Custom roles can be created without code changes
2. **Granularity:** Fine-grained control at resource + action + scope level
3. **Scalability:** New resources/actions can be added via enum extension
4. **Type Safety:** Compile-time checking prevents permission errors
5. **Maintainability:** Clear separation of concerns, single source of truth
6. **User Experience:** Intuitive UI for role management
7. **Future-Proof:** Field-level access and other features can be added incrementally

### Negative

1. **Complexity:** More complex than simple role enum system
2. **Performance:** Database queries on every permission check (mitigated by caching)
3. **Migration:** Requires data migration from old role system
4. **Testing:** More test cases needed for permission combinations
5. **Incomplete Implementation:** Some controllers may not fully implement scope checks (see security review)

### Neutral

1. **Database Size:** Additional tables increase schema complexity (minor impact)
2. **Learning Curve:** Developers need to understand RBAC concepts
3. **UI Maintenance:** Role management UI requires ongoing maintenance

## Implementation Details

### Migration Path

1. Database migration created: `src/api/hris/prisma/migrations/20260107141243_rbac_model/`
2. Seed script for OWNER role: `src/api/hris/prisma/seeds/rbac-seed.ts`
3. Backward compatibility maintained via legacy wrappers: `isOwner()` function

### Testing Strategy

**Required Test Coverage:**
- [ ] Unit tests for permission checker logic
- [ ] Integration tests for scope enforcement
- [ ] E2E tests for role assignment UI
- [ ] Security tests for unauthorized access attempts
- [ ] Migration tests for data integrity

### Documentation

**Developer Documentation Needed:**
- [ ] How to add new resources
- [ ] How to add new actions
- [ ] Permission check implementation guide
- [ ] Role creation best practices

## References

- Database Schema: `src/api/hris/prisma/schema/auth.prisma`
- Permission Types: `src/api/hris/authorization/permissions.ts`
- Permission Checker: `src/api/hris/authorization/permissionChecker.ts`
- Authorization Middleware: `src/api/hris/authorization/authorization.ts`
- Role Controller: `src/api/hris/authorization/infrastructure/controllers/roles.controller.ts`
- UI Components: `src/app/(hris)/settings/roles/`
- Example Implementation: `src/api/hris/employees/infrastructure/controllers/employees-earnings.controller.ts`

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-07 | 1.0 | Initial RBAC implementation |
| 2026-01-08 | 1.1 | Security review and recommendations added |
