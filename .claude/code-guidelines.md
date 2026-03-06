# DutyDuke Development Guidelines for Claude Code

This document provides comprehensive guidelines for Claude Code to assist with DutyDuke development. It covers architecture, patterns, conventions, and best practices.

## Table of Contents
1. [Project Architecture](#project-architecture)
2. [Layer Responsibilities](#layer-responsibilities)
3. [File Organization](#file-organization)
4. [Naming Conventions](#naming-conventions)
5. [Development Patterns](#development-patterns)
6. [Feature Development Workflow](#feature-development-workflow)
7. [Code Examples](#code-examples)
8. [Common Scenarios](#common-scenarios)

---

## Project Architecture

### Overview
DutyDuke is an open-source **HRIS** (Human Resource Information System) following **Clean Architecture** principles with **Domain-Driven Design**.

**Tech Stack**:
- **Frontend**: Next.js 15 (App Router), TypeScript, React Server Actions
- **Backend**: Node.js, Prisma ORM, PostgreSQL with PostGIS
- **Architecture**: Clean Architecture, Repository Pattern, Use Case Pattern
- **Database**: Single PostgreSQL database

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                    │
│  - Employees, Absences, Resources, Company, etc.         │
│  - RBAC (Roles, Permissions)                             │
│  - Dictionary/Configuration entities                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    HRIS API Layer                         │
│  Clean Architecture: Domain → Infrastructure → Presentation │
└─────────────────────────────────────────────────────────┘
```

---

## Directory Structure & Conventions

### API Layer Structure (`src/api/`)

```
src/api/
└── hris/                          # Core HRIS operations
    ├── prisma/schema              # Database schema
    ├── index.ts                   # API entry point
    ├── authorization/             # Auth middleware & ACL
    └── [domain]/                  # e.g., employees, absences, resources
        ├── model/
        │   ├── dtos/              # TypeScript DTOs
        │   ├── repositories/      # Repository type definitions
        │   ├── use-cases/         # Business logic functions
        │   └── acl/               # ACL type definitions
        ├── infrastructure/
        │   ├── controllers/       # Controller functions
        │   ├── database/
        │   │   ├── repositories/  # Prisma implementations
        │   │   └── queries/       # Complex queries
        │   └── acl/               # ACL implementations
        ├── errors.ts              # Domain-specific errors
        └── index.ts               # Domain API export
```

### Frontend Structure (`src/app/`)

```
src/app/
├── (auth)/                        # Auth routes (sign-in, sign-up)
├── (hris)/                        # Protected HRIS routes
│   ├── [feature]/                 # e.g., employees, company, settings
│   │   ├── [id]/                  # Dynamic route (optional)
│   │   │   ├── _actions/          # Server actions
│   │   │   ├── _components/       # Page-specific components
│   │   │   ├── _schemas/          # Zod validation schemas
│   │   │   └── page.tsx           # Page component
│   │   └── page.tsx
│   ├── _actions/                  # Shared actions
│   ├── _components/               # Shared components
│   └── _schema/                   # Shared schemas
├── api/                           # API routes (Next.js)
└── (public)/                      # Public routes
```

### Shared Code (`src/shared/`)

```
src/shared/
├── constants/                     # App-wide constants
├── errors/                        # Error classes
├── schemas/                       # Zod schemas
├── service/                       # Services (email, file, locale)
├── types/                         # TypeScript types
└── utils/                         # Utility functions
```

## Naming Conventions

### Files & Directories
- **Use kebab-case**: `employee-skills.controller.ts`, `update-employee.use-case.ts`
- **Use descriptive names**: Include the purpose in the name
- **Private directories**: Prefix with `_` (e.g., `_actions`, `_components`)

### TypeScript Naming
- **Types/Interfaces**: PascalCase with descriptive suffix
  - DTOs: `EmployeeDto`, `CreateEmployeeDto`, `UpdateEmployeeDto`
  - Repositories: `EmployeeRepository`
  - Controllers: `EmployeesController`
  - Use Cases: `createEmployeeUseCase` (function name)
- **Functions**: camelCase with verb prefix
  - `createEmployee`, `updateEmployee`, `deleteEmployee`
  - Use cases: `createEmployeeUseCase`, `updateEmployeeUseCase`
- **Constants**: UPPER_SNAKE_CASE
  - `EMPLOYEE_ERROR_MESSAGES`, `ITEMS_PER_PAGE`

### DTO Patterns
- **Base DTO**: Full entity (`EmployeeDto`)
- **Create DTO**: `CreateEmployeeDto` (WithoutId<EmployeeDto>)
- **Update DTO**: `UpdateEmployeeDto` (Partial fields)
- **List DTO**: `EmployeeListDto` (Paginated<BaseEmployeeDto>)
- **With Access**: `EmployeeWithAccessDto` (WithAccess<EmployeeDto>)

## Development Patterns

### 1. Repository Pattern
**Repository Type** (`model/repositories/`):
```typescript
export type EmployeeRepository = {
  createEmployee: (employee: CreateEmployeeDto) => Promise<CUID>;
  updateEmployee: (id: CUID, data: Partial<UpdateEmployeeDto>) => Promise<void>;
  deleteEmployee: (id: CUID) => Promise<void>;
};
```

**Repository Implementation** (`infrastructure/database/repositories/`):
```typescript
export function employeeRepository(db: PrismaClient): EmployeeRepository {
  return {
    createEmployee: async (employee) => {
      const result = await db.employee.create({ data: employee });
      return result.id;
    },
    // ... other implementations
  };
}
```

### 2. Use Case Pattern
**Location**: `model/use-cases/[action]-[entity].use-case.ts`

**Pattern**:
```typescript
export function createEmployeeUseCase(repository: EmployeeRepository) {
  return async (employee: CreateEmployeeDto): Promise<CUID> => {
    try {
      // Business logic validation
      if (!employee.workEmail) {
        throw new ApiError(400, EMPLOYEE_ERROR_MESSAGES.INVALID_EMAIL);
      }

      // Call repository
      return await repository.createEmployee(employee);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, EMPLOYEE_ERROR_MESSAGES.CREATE_FAILED);
    }
  };
}
```

**Always**:
- Use curried function pattern (returns async function)
- Accept dependencies as parameters (repository, etc.)
- Handle errors with try-catch
- Log errors with logger
- Throw ApiError with meaningful messages

### 3. Controller Pattern
**Location**: `infrastructure/controllers/[entity].controller.ts`

**Pattern**:
```typescript
export type EmployeesController = {
  createEmployee: (data: CreateEmployeeDto) => Promise<CUID>;
  updateEmployee: (id: CUID, data: UpdateEmployeeDto) => Promise<void>;
};

export function employeesController(db: PrismaClient): EmployeesController {
  const repository = employeeRepository(db);
  const queries = employeeQueries(db);

  const createEmployee = async (data: CreateEmployeeDto) => {
    const exists = await queries.getEmployeeByEmail(data.workEmail);
    if (exists) {
      throw new ApiError(400, EMPLOYEE_ERROR_MESSAGES.ALREADY_EXISTS);
    }

    return await createEmployeeUseCase(repository)(data);
  };

  return {
    createEmployee: privateRoute(createEmployee),
  };
}
```

### 4. Server Actions Pattern
**Location**: `app/(hris)/[feature]/[id]/_actions/[action].action.ts`

**Pattern**:
```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { instantiateHrisApi } from '@/api/hris';
import { type ActionReturnType, handleActionError } from '@/shared';
import { logger } from '@/shared/service/pino';
import { employeeSchema, type EmployeeForm } from '../_schemas';

type UpdateEmployeeState = ActionReturnType<
  EmployeeForm,
  undefined,
  ActionReturnValidationErrorsType<EmployeeForm>
>;

export async function updateEmployeeAction(
  prevState: UpdateEmployeeState,
  formData: FormData,
): Promise<UpdateEmployeeState> {
  // 1. Parse form data
  const form: EmployeeForm = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
  };

  // 2. Validate with Zod
  const validation = employeeSchema.safeParse(form);
  if (!validation.success) {
    return {
      ...prevState,
      form,
      status: 'validation-error',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  // 3. Call API
  try {
    const api = await instantiateHrisApi();
    await api.employees.updateEmployee(prevState.form.employeeId, validation.data);
  } catch (err) {
    logger.info(err);
    return { ...prevState, ...handleActionError(err) };
  }

  // 4. Revalidate cache
  revalidatePath(HRIS_ROUTES.employees.base);

  // 5. Return success
  return {
    ...prevState,
    status: 'success',
    form,
    data: undefined,
  };
}
```

**Always**:
- Use `'use server'` directive
- Accept `prevState` and `formData`
- Validate with Zod schemas
- Use `instantiateHrisApi()` to get API instance
- Use `handleActionError()` for error handling
- Use `revalidatePath()` after mutations
- Return typed `ActionReturnType`

### 5. ACL (Access Control Layer) Pattern
**ACL Type** (`model/acl/`):
```typescript
export type ResourcesAcl = {
  getEmployeeSkills: (type: SkillType, employeeId: CUID, skillIds: CUID[]) => Promise<EmployeeSkillDto[]>;
  createEmployeeSkill: (name: string) => Promise<CUID>;
};
```

**ACL Implementation** (`infrastructure/acl/`):
```typescript
export function resourcesAcl(db: PrismaClient): ResourcesAcl {
  const getEmployeeSkills = async (type, employeeId, skillIds) => {
    const api = instantiateHrisApi(db);
    const skills = await Promise.all(
      skillIds.map((id) => api.resources.getSkillById(id))
    );
    return skills.filter(Boolean).map(/* transform */);
  };

  return {
    getEmployeeSkills,
    createEmployeeSkill: /* ... */,
  };
}
```

**Purpose**: ACLs handle cross-domain communication and data transformation

### 6. Queries Pattern
**Location**: `infrastructure/database/queries/[entity].queries.ts`

**Pattern**:
```typescript
export type EmployeeQueries = {
  getEmployeeById: (id: CUID) => Promise<Nullable<EmployeeDto>>;
  getAllEmployees: (search?: string) => Promise<EmployeeDto[]>;
};

export function employeeQueries(db: PrismaClient): EmployeeQueries {
  return {
    getEmployeeById: async (id) => {
      const employee = await db.employee.findUnique({
        where: { id },
        include: { /* relations */ },
      });
      return employee ? mapToDto(employee) : null;
    },
  };
}
```

## Error Handling

### Error Messages
**Location**: `[domain]/errors.ts`

```typescript
export const EMPLOYEE_ERROR_MESSAGES = {
  NOT_FOUND: (id: string) => `Employee with id ${id} was not found`,
  CREATE_FAILED: 'Creating employee failed',
  UPDATE_FAILED: 'Updating employee failed',
  ARCHIVED: 'Cannot update archived employee',
};
```

### Using Errors
```typescript
throw new ApiError(404, EMPLOYEE_ERROR_MESSAGES.NOT_FOUND(employeeId));
throw new ApiError(500, EMPLOYEE_ERROR_MESSAGES.UPDATE_FAILED);
```

## Authorization

### Authorization Wrappers
- `privateRoute()`: Requires authentication
- `getUserRoles()`: Get current user roles

**Usage**:
```typescript
return {
  createEmployee: privateRoute(createEmployee),
  deleteEmployee: privateRoute(deleteEmployee),
};
```

## Database & Prisma

### Schema Location
- **HRIS Schema**: `src/api/hris/prisma/schema`

### Commands
```bash
yarn prisma:generate    # Generate Prisma client
yarn prisma:migrate     # Create migration
yarn prisma:migrate:deploy  # Apply migrations
yarn prisma:reset       # Reset database
yarn prisma:studio      # Open Prisma Studio
yarn prisma:seed        # Seed database
```

## API Instantiation

### HRIS API
```typescript
const api = await instantiateHrisApi();
await api.employees.createEmployee(data);
await api.resources.getSkillById(id);
```

## When Adding New Features

### 1. Add New Domain to HRIS API
```
src/api/hris/[domain]/
├── model/
│   ├── dtos/
│   │   └── [entity].dto.ts
│   ├── repositories/
│   │   └── [entity].repository.type.ts
│   ├── use-cases/
│   │   ├── create-[entity].use-case.ts
│   │   ├── update-[entity].use-case.ts
│   │   ├── delete-[entity].use-case.ts
│   │   └── index.ts
│   └── [entity].ts (optional: domain model)
├── infrastructure/
│   ├── controllers/
│   │   └── [entity].controller.ts
│   ├── database/
│   │   ├── repositories/
│   │   │   └── [entity].repository.ts
│   │   └── queries/
│   │       └── [entity].queries.ts
│   └── acl/ (if needed)
│       └── [entity].acl.ts
├── errors.ts
└── index.ts
```

**Steps**:
1. Define Prisma schema in `src/api/hris/prisma/schema`
2. Create migration: `yarn prisma:migrate`
3. Create DTOs in `model/dtos/`
4. Create repository type in `model/repositories/`
5. Create use cases in `model/use-cases/`
6. Implement repository in `infrastructure/database/repositories/`
7. Create queries in `infrastructure/database/queries/`
8. Create controller in `infrastructure/controllers/`
9. Export API in `index.ts`
10. Register in `src/api/hris/index.ts`

### 2. Add New Feature to Frontend
```
src/app/(hris)/[feature]/
├── [id]/                        # Dynamic route (optional)
│   ├── _actions/
│   │   ├── create-[entity].action.ts
│   │   ├── update-[entity].action.ts
│   │   └── delete-[entity].action.ts
│   ├── _components/
│   │   ├── [entity]-form.tsx
│   │   └── [entity]-list.tsx
│   ├── _schemas/
│   │   └── [entity].schema.ts
│   └── page.tsx
└── page.tsx
```

## Code Quality Rules

### TypeScript
- **Always use explicit return types** for functions
- **Use type inference** for variables when obvious
- **Prefer type over interface** unless extending
- **Use const assertions** for literal types
- **Avoid any**: Use unknown and type guards instead

### Async/Await
- Always use async/await (never Promises with .then())
- Handle errors with try-catch in use cases
- Use Promise.all() for parallel operations

### Imports
- Use path alias `@/` for absolute imports
- Group imports: external -> Next.js -> internal -> relative
- Sort imports alphabetically within groups

### Performance
- Use `revalidatePath()` instead of `revalidateTag()` when possible
- Minimize database queries (use includes/select)
- Use Prisma transactions for multiple mutations
- Cache static data appropriately

### Security
- Never expose database connection strings
- Always validate input with Zod
- Use parameterized queries (Prisma handles this)
- Sanitize user input
- Use authorization wrappers (privateRoute)

## Logging

Use Pino logger:
```typescript
import { logger } from '@/shared/service/pino';

logger.info('Operation successful', { employeeId });
logger.error('Operation failed', { error });
```

## Environment Variables

Required variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Authentication secret
- `PRISMA_FIELD_ENCRYPTION_KEY`: Field encryption key
- `NEXT_PUBLIC_APP_URL`: Application URL
- `NEXT_PUBLIC_THEME`: UI theme (hris default, or custom)
- `NEXT_PUBLIC_DEFAULT_LANGUAGE`: Default locale

## Common Pitfalls

### Don't
- Don't mix business logic in controllers
- Don't access database directly from actions
- Don't use .then/.catch (use async/await)
- Don't create circular dependencies
- Don't forget to export from index.ts files
- Don't forget to add migrations after schema changes
- Don't skip validation in server actions
- Don't use relative imports across domains

### Do
- Keep use cases pure and testable
- Use repositories for data access
- Use DTOs for data transfer
- Follow the established patterns
- Use meaningful error messages
- Log errors appropriately
- Validate all inputs
- Use TypeScript strictly
- Follow naming conventions
- Keep functions small and focused

## Quick Reference

### Creating a New Use Case
```typescript
// model/use-cases/action-entity.use-case.ts
export function actionEntityUseCase(repository: EntityRepository) {
  return async (params: ParamsDto): Promise<ReturnType> => {
    try {
      // Business logic
      return await repository.action(params);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, ERROR_MESSAGES.ACTION_FAILED);
    }
  };
}
```

### Creating a Server Action
```typescript
'use server';
// Pattern: validation -> API call -> revalidate -> return
```

### Registering New Domain API
```typescript
// src/api/hris/index.ts
export async function instantiateHrisApi() {
  return {
    // ... existing
    newDomain: newDomainApi(db),
  };
}
```

---

**Remember**: Consistency is key. Follow existing patterns, and when in doubt, look at similar implementations in the codebase.
