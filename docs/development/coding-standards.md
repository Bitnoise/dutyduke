# Coding Standards

## Architecture Patterns

### Repository Pattern

Repository types define the interface (model layer), implementations use Prisma (infrastructure layer).

**Type definition** (`model/repositories/`):
```typescript
export type EmployeeRepository = {
  createEmployee: (employee: CreateEmployeeDto) => Promise<CUID>;
  updateEmployee: (id: CUID, data: Partial<UpdateEmployeeDto>) => Promise<void>;
  deleteEmployee: (id: CUID) => Promise<void>;
};
```

**Implementation** (`infrastructure/database/repositories/`):
```typescript
export function employeeRepository(db: PrismaClient): EmployeeRepository {
  return {
    createEmployee: async (employee) => {
      const result = await db.employee.create({ data: employee });
      return result.id;
    },
  };
}
```

### Use Case Pattern

Business logic as curried functions. Dependencies injected via parameters.

**Location**: `model/use-cases/[action]-[entity].use-case.ts`

```typescript
export function createEmployeeUseCase(repository: EmployeeRepository) {
  return async (employee: CreateEmployeeDto): Promise<CUID> => {
    try {
      if (!employee.workEmail) {
        throw new ApiError(400, EMPLOYEE_ERROR_MESSAGES.INVALID_EMAIL);
      }
      return await repository.createEmployee(employee);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, EMPLOYEE_ERROR_MESSAGES.CREATE_FAILED);
    }
  };
}
```

Rules:
- Curried function pattern (returns async function)
- Accept dependencies as parameters
- Handle errors with try-catch
- Log errors with Pino logger
- Throw `ApiError` with meaningful messages

### Controller Pattern

Controllers wire up repositories, queries, and use cases. Apply authorization.

**Location**: `infrastructure/controllers/[entity].controller.ts`

```typescript
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

### Queries Pattern

Read-only database access, separate from repositories.

**Location**: `infrastructure/database/queries/[entity].queries.ts`

```typescript
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

### Server Actions Pattern

**Location**: `app/(hris)/[feature]/_actions/[action].action.ts`

```typescript
'use server';

export async function updateEmployeeAction(
  prevState: UpdateEmployeeState,
  formData: FormData,
): Promise<UpdateEmployeeState> {
  // 1. Parse form data
  const form = { firstName: formData.get('firstName') as string };

  // 2. Validate with Zod
  const validation = employeeSchema.safeParse(form);
  if (!validation.success) {
    return { ...prevState, form, status: 'validation-error', errors: validation.error.flatten().fieldErrors };
  }

  // 3. Call API
  try {
    const api = await instantiateHrisApi();
    await api.employees.updateEmployee(id, validation.data);
  } catch (err) {
    logger.info(err);
    return { ...prevState, ...handleActionError(err) };
  }

  // 4. Revalidate and return
  revalidatePath(HRIS_ROUTES.employees.base);
  return { ...prevState, status: 'success', form, data: undefined };
}
```

Rules:
- Always use `'use server'` directive
- Validate with Zod schemas
- Use `handleActionError()` for error handling
- Use `revalidatePath()` after mutations
- Return typed `ActionReturnType`

### ACL Pattern (Anti-Corruption Layer)

For cross-domain communication between API domains.

**Type** (`model/acl/`):
```typescript
export type ResourcesAcl = {
  getEmployeeSkills: (type: SkillType, employeeId: CUID, skillIds: CUID[]) => Promise<EmployeeSkillDto[]>;
};
```

**Implementation** (`infrastructure/acl/`):
```typescript
export function resourcesAcl(db: PrismaClient): ResourcesAcl {
  return {
    getEmployeeSkills: async (type, employeeId, skillIds) => {
      const api = instantiateHrisApi(db);
      return await api.resources.getSkillsByIds(skillIds);
    },
  };
}
```

## Naming Conventions

### Files and Directories

- **kebab-case** for all files: `employee-skills.controller.ts`, `update-employee.use-case.ts`
- **Private directories** prefixed with `_`: `_actions/`, `_components/`, `_schemas/`
- **Suffix indicates purpose**: `.controller.ts`, `.use-case.ts`, `.repository.ts`, `.dto.ts`, `.queries.ts`

### TypeScript

| Category | Convention | Example |
|----------|-----------|---------|
| Types/Interfaces | PascalCase | `EmployeeDto`, `CreateEmployeeDto` |
| Functions | camelCase with verb | `createEmployee`, `getEmployeeById` |
| Use cases | camelCase + UseCase | `createEmployeeUseCase` |
| Constants | UPPER_SNAKE_CASE | `EMPLOYEE_ERROR_MESSAGES` |
| Repositories | type name = PascalCase | `EmployeeRepository` |
| Controllers | type name = PascalCase | `EmployeesController` |

### DTO Patterns

| Pattern | Example | Usage |
|---------|---------|-------|
| Base | `EmployeeDto` | Full entity |
| Create | `CreateEmployeeDto` | `WithoutId<EmployeeDto>` |
| Update | `UpdateEmployeeDto` | Partial fields |
| List | `EmployeeListDto` | `Paginated<BaseEmployeeDto>` |
| With access | `EmployeeWithAccessDto` | `WithAccess<EmployeeDto>` |

## Error Handling

### Error Messages

**Location**: `[domain]/errors.ts`

```typescript
export const EMPLOYEE_ERROR_MESSAGES = {
  NOT_FOUND: (id: string) => `Employee with id ${id} was not found`,
  CREATE_FAILED: 'Creating employee failed',
  UPDATE_FAILED: 'Updating employee failed',
};
```

### Throwing Errors

```typescript
throw new ApiError(404, EMPLOYEE_ERROR_MESSAGES.NOT_FOUND(employeeId));
throw new ApiError(500, EMPLOYEE_ERROR_MESSAGES.UPDATE_FAILED);
```

## Code Quality Rules

### TypeScript
- Always use explicit return types for functions
- Prefer `type` over `interface` unless extending
- Never use `any` — use `unknown` and type guards
- Use const assertions for literal types

### Async/Await
- Always use async/await (never `.then()/.catch()`)
- Handle errors with try-catch in use cases
- Use `Promise.all()` for parallel operations

### Imports
- Use path alias `@/` for absolute imports
- Group: external -> Next.js -> internal -> relative
- Sort alphabetically within groups
- Never use relative imports across domains

### Performance
- Use `revalidatePath()` after mutations
- Minimize database queries (use includes/select)
- Use Prisma transactions for multiple writes

### Security
- Always validate input with Zod
- Use authorization wrappers (`privateRoute`, `requirePermission`)
- Never expose database connection strings
- Sanitize user input

## Adding a New Feature

1. Define Prisma schema in `src/api/hris/prisma/schema/`
2. Create migration: `yarn prisma:migrate`
3. Create DTOs in `model/dtos/`
4. Create repository type in `model/repositories/`
5. Create use cases in `model/use-cases/`
6. Implement repository in `infrastructure/database/repositories/`
7. Create queries in `infrastructure/database/queries/`
8. Create controller in `infrastructure/controllers/`
9. Export in `index.ts` and register in `src/api/hris/index.ts`
10. Build frontend: Zod schema, server actions, components, page
11. Add translations to `messages/en.json` and `messages/pl.json`
