# Installation

## Prerequisites

- **Node.js** — see `.nvmrc` for the required version (use `nvm use` to switch)
- **Yarn** — package manager (do not use npm or pnpm)
- **Docker & Docker Compose** — for PostgreSQL and Mailcatcher
- **Git**

## Step-by-Step Setup

### 1. Clone the repository

```bash
git clone https://github.com/Bitnoise/dutyduke.git
cd dutyduke
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Configure environment

```bash
cp .env.dist .env
```

Edit `.env` and set the required values:

- **`PRISMA_FIELD_ENCRYPTION_KEY`** — generate at https://cloak.47ng.com/ (click "New key")
- **`JWT_SECRET`** — generate with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(128).toString('hex'))"
  ```

See [configuration.md](configuration.md) for all environment variables.

### 4. Start services

```bash
docker compose up -d
```

This starts:
- **PostgreSQL** (port 5432) with PostGIS extension
- **Mailcatcher** (SMTP on port 1025, UI on port 1080)

Verify services are running:
```bash
docker compose ps
```

### 5. Setup database

Generate the Prisma client:
```bash
yarn prisma:generate
```

Run migrations (when prompted, name the migration e.g. "init"):
```bash
yarn prisma:migrate
```

Seed the database with the default organization and OWNER role:
```bash
yarn prisma:seed
```

### 6. Create your admin account

```bash
yarn create:owner admin@example.com YourPassword123 John Doe
```

This creates an identity with the OWNER role and full system permissions.

### 7. Create your organization

```bash
yarn organization:create "My Company"
```

### 8. Start the development server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with your admin credentials.

## Verify Installation

After starting, you should be able to:
1. Access the sign-in page at http://localhost:3000
2. Sign in with the admin account you created
3. See the dashboard with employee management, company settings, etc.
4. Access Mailcatcher at http://localhost:1080 to view sent emails

## Troubleshooting

### Database connection issues

```bash
# Check if services are running
docker compose ps

# View database logs
docker compose logs postgres

# Test connection manually
psql postgresql://dutyduke:password@localhost:5432/dutyduke
```

### Reset database

```bash
# Reset via Prisma (deletes all data, re-applies migrations)
yarn prisma:reset

# Or full reset (removes Docker volume)
docker compose down -v
docker compose up -d
yarn prisma:migrate
yarn prisma:seed
```

### Clean install

If you have dependency or build cache issues:
```bash
yarn nuke
```

This removes `node_modules`, `.next`, clears the Yarn cache, and reinstalls everything.
