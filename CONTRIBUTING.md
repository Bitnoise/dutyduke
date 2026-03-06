# Contributing to DutyDuke

Thank you for your interest in contributing to DutyDuke! This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js (see `.nvmrc`)
- Yarn (required - do not use npm or pnpm)
- Docker & Docker Compose
- PostgreSQL client (optional, for debugging)

### Getting Started

```bash
git clone https://github.com/Bitnoise/dutyduke.git
cd dutyduke
yarn install
cp .env.dist .env
# Configure .env (see README.md for required variables)
docker compose up -d
yarn prisma:generate
yarn prisma:migrate
yarn prisma:seed
yarn create:owner your@email.com password123 Your Name
yarn dev
```

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready releases |
| `qa` | Pre-release testing |
| `development` | Active development (PR target) |

All pull requests should target the `development` branch.

## Pull Request Process

1. Fork the repository and create your branch from `development`
2. Name your branch descriptively: `feat/employee-export`, `fix/absence-calculation`, etc.
3. Make your changes, ensuring `yarn lint` and `yarn build` pass
4. Write a clear PR description explaining what and why
5. Submit your PR against `development`

## Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add employee export to CSV
fix: correct absence day calculation for part-time employees
docs: update setup instructions
refactor: simplify permission checking logic
chore: update dependencies
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `refactor` | Code refactoring (no feature/fix) |
| `chore` | Maintenance, dependencies, tooling |
| `test` | Adding or updating tests |

## Code Style

### Architecture

The project follows Clean Architecture. Each domain in `src/api/hris/` has:

- `model/` - DTOs, repository interfaces, use cases (business logic)
- `infrastructure/` - Prisma repositories, controllers, ACLs, queries

See `.claude/code-guidelines.md` for detailed patterns and examples.

### Key Rules

- **TypeScript strict mode** - no `any`, use explicit return types
- **Async/await** - never use `.then()/.catch()`
- **Path aliases** - use `@/` for imports, never relative paths across domains
- **Validation** - use Zod schemas for all input validation
- **Naming** - kebab-case files, PascalCase types, camelCase functions

### Before Submitting

```bash
yarn lint          # ESLint + TypeScript check (must pass)
yarn build         # Production build (must pass)
```

## Project Structure

```
src/
  api/hris/         # Backend API domains
  app/               # Next.js App Router (pages, actions, components)
  lib/ui/            # Shared UI component library
  shared/            # Constants, types, utils, services
  templates/         # Email and PDF templates
messages/            # i18n translation files (en.json, pl.json)
```

## Adding a New Feature

1. Define Prisma schema changes in `src/api/hris/prisma/schema/`
2. Create migration: `yarn prisma:migrate`
3. Create domain structure: DTOs, repository type, use cases
4. Implement: repository, queries, controller
5. Register in `src/api/hris/index.ts`
6. Build frontend: pages, server actions, components
7. Add translations to `messages/en.json` and `messages/pl.json`

## Reporting Issues

Use GitHub Issues. Include:
- Clear description of the problem or feature request
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Environment details (OS, Node version, browser)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
