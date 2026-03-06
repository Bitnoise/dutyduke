# Architecture Overview

DutyDuke follows **Clean Architecture** principles with **Domain-Driven Design**, ensuring clear separation between business logic, infrastructure, and presentation.

## High-Level Architecture

```
┌─────────────────────────────────────────────┐
│              Next.js App Router              │
│         (Pages, Server Actions, UI)         │
├─────────────────────────────────────────────┤
│               HRIS API Layer                │
│    (Controllers, Use Cases, Repositories)   │
├─────────────────────────────────────────────┤
│          PostgreSQL + PostGIS               │
│    (Prisma ORM, Field-Level Encryption)     │
└─────────────────────────────────────────────┘
```

## Domain Structure

The backend API is organized by domain, each following the same layered pattern:

```
src/api/hris/
├── authentication/     # Login, JWT, password management
├── authorization/      # RBAC, permissions (see rbac.md)
├── employees/          # Employee profiles, skills, education
├── company/            # Company settings, organization data
├── absences/           # Leave requests, availability, policies
├── benefits/           # Benefit plans and assignments
├── documents/          # Document upload, categorization, tracking
├── feedback/           # Performance feedback sessions
├── resources/          # Skills, equipment, dictionaries
├── settings/           # Application configuration
└── prisma/             # Schema, migrations, seed, client
```

## Layers Within Each Domain

```
[domain]/
├── model/                          # Domain Layer (pure business logic)
│   ├── dtos/                       # Data Transfer Objects
│   ├── repositories/               # Repository interfaces (types only)
│   ├── use-cases/                  # Business logic functions
│   └── acl/                        # ACL interfaces (cross-domain)
│
├── infrastructure/                 # Infrastructure Layer
│   ├── controllers/                # Orchestrate use cases, authorization
│   ├── database/
│   │   ├── repositories/           # Prisma implementations
│   │   └── queries/                # Read-only database queries
│   └── acl/                        # ACL implementations
│
├── errors.ts                       # Domain-specific error messages
└── index.ts                        # Public API exports
```

### Layer Responsibilities

**Model Layer** — Contains no framework or database dependencies. Pure TypeScript.
- **DTOs**: Define data shapes for transfer between layers
- **Repository types**: Interfaces that infrastructure implements
- **Use cases**: Business rules as curried functions accepting repository dependencies
- **ACL types**: Interfaces for cross-domain communication

**Infrastructure Layer** — Implements interfaces defined in the model layer.
- **Controllers**: Entry points that wire up repositories, queries, and use cases. Apply authorization.
- **Repositories**: Prisma-based implementations of repository interfaces
- **Queries**: Read-optimized database access (separate from write repositories)
- **ACLs**: Cross-domain data access implementations

## Frontend Architecture

```
src/app/
├── (auth)/              # Public auth routes (sign-in, password recovery)
├── (hris)/              # Protected HR routes
│   ├── employees/       # Employee management pages
│   ├── company/         # Company settings, absences, equipment, etc.
│   ├── settings/        # App settings, roles
│   ├── _actions/        # Shared server actions
│   ├── _components/     # Shared components
│   └── _schema/         # Shared Zod schemas
├── (public)/            # Public pages
└── api/                 # API routes (downloads, photos, calendar)
```

### Frontend Patterns

- **Server Actions** for mutations (form submissions, data changes)
- **Server Components** for data fetching (pages, layouts)
- **Client Components** only where interactivity is needed (forms, modals)
- **Private directories** (`_actions/`, `_components/`, `_schemas/`) co-located with features

## Shared Code

```
src/shared/
├── constants/           # Routes, search params, app constants
├── errors/              # ApiError class, error handling utilities
├── schemas/             # Common Zod schemas
├── service/             # Email, locale, logging, file services
├── types/               # Global TypeScript types (CUID, Nullable, etc.)
└── utils/               # Utility functions
```

## UI Component Library

```
src/lib/ui/
├── components/          # Button, Input, Modal, Select, Table, etc.
├── hooks/               # useQueryParams, useDebounce, etc.
└── icons/               # SVG icon components
```

Built on **React Aria Components** for accessibility and **Tailwind CSS** for styling.

## Database

- **PostgreSQL 16** with **PostGIS** extension
- **Prisma 5** ORM with TypeScript-generated client
- **Field-level encryption** via `prisma-field-encryption` for sensitive data
- Schema located at `src/api/hris/prisma/schema/`
- Singleton Prisma client with static connection

## Authentication & Authorization

- **JWT-based authentication** — tokens issued on login, verified per request
- **RBAC** — role-based access control with granular permissions per resource and action
- See [rbac.md](rbac.md) for the full RBAC architecture

## Key Design Decisions

1. **Single organization model** — one database per deployment, no multi-tenancy overhead
2. **Clean Architecture** — business logic is framework-independent and testable
3. **Repository pattern** — database access is abstracted behind interfaces
4. **Curried use cases** — dependencies injected via function parameters, not classes
5. **Server Actions over API routes** — Next.js server actions for form mutations
6. **Co-located frontend** — actions, components, and schemas live next to their pages
