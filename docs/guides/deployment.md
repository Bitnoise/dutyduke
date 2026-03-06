# Deployment

## Docker Production Build

DutyDuke includes a `Dockerfile` for production deployments.

### Build the image

```bash
docker build -t dutyduke .
```

The Dockerfile:
1. Installs dependencies with `yarn install --ignore-scripts`
2. Generates the Prisma client
3. Builds the Next.js application
4. On start: runs migrations, then starts the server

### Run with Docker Compose

For a full production-like setup, use Docker Compose with your own `.env`:

```bash
# Start PostgreSQL + Mailcatcher
docker compose up -d

# Or run the app container alongside
docker build -t dutyduke .
docker run --env-file .env -p 3000:3000 --network host dutyduke
```

### Production Environment

For production, ensure:

1. **Generate unique secrets:**
   ```bash
   # JWT Secret
   node -e "console.log(require('crypto').randomBytes(128).toString('hex'))"

   # Prisma encryption key
   # Generate at https://cloak.47ng.com/
   ```

2. **Configure SMTP** — point `mailer_smtp_*` variables to your email provider

3. **Set the app URL** — `NEXT_PUBLIC_APP_URL` must match your domain

4. **Use a managed database** — or ensure PostgreSQL has PostGIS installed:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```

5. **Run migrations on deploy:**
   ```bash
   yarn prisma:migrate:deploy
   ```
   The Dockerfile CMD does this automatically on container start.

## Database Migrations

### Development
```bash
yarn prisma:migrate          # Creates and applies a new migration
```

### Production
```bash
yarn prisma:migrate:deploy   # Applies pending migrations (no prompts)
```

### Reset (development only)
```bash
yarn prisma:reset            # Drops and recreates the database
```

## Environment Checklist

Before deploying to production:

- [ ] Unique `JWT_SECRET` generated
- [ ] Unique `PRISMA_FIELD_ENCRYPTION_KEY` generated
- [ ] `NEXT_PUBLIC_APP_URL` set to production domain
- [ ] SMTP configured for real email delivery
- [ ] `SUPPORT_PASSWORD` set to a strong value
- [ ] PostgreSQL has PostGIS extension enabled
- [ ] Database backups configured
