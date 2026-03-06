# Configuration

All configuration is done via environment variables. Copy `.env.dist` to `.env` and adjust values.

## Required Variables

| Variable | Description | How to Generate |
|----------|-------------|-----------------|
| `DATABASE_URL` | PostgreSQL connection string | Auto-composed from `DB_*` variables |
| `DB_HOST` | Database host | `localhost` for local development |
| `DB_PORT` | Database port | `5432` (default) |
| `DB_USERNAME` | Database user | `dutyduke` (default) |
| `DB_PASSWORD` | Database password | Set your own |
| `DB_NAME` | Database name | `dutyduke` (default) |
| `PRISMA_FIELD_ENCRYPTION_KEY` | Encryption key for sensitive fields | Generate at https://cloak.47ng.com/ |
| `JWT_SECRET` | Secret for signing JWT tokens | `node -e "console.log(require('crypto').randomBytes(128).toString('hex'))"` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` for development |

## Organization

| Variable | Description | Default |
|----------|-------------|---------|
| `ORGANIZATION_NAME` | Company name (used in seeding) | `"My Company"` |
| `ORGANIZATION_TAX_ID` | Company tax ID | Empty |

## Application

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_THEME` | UI theme class applied to `<body>` | `hris` |
| `NEXT_PUBLIC_DEFAULT_LANGUAGE` | Default locale | `en` |
| `ITEMS_PER_PAGE` | Pagination page size | `20` |
| `HOMEPAGE` | Custom homepage URL | Empty |

## Email (SMTP)

| Variable | Description | Default |
|----------|-------------|---------|
| `mailer_smtp_host` | SMTP server host | `localhost` |
| `mailer_smtp_port` | SMTP server port | `1025` (Mailcatcher) |
| `mailer_smtp_isSecure` | Use TLS | `false` |
| `mailer_smtp_user` | SMTP username | `user` |
| `mailer_smtp_password` | SMTP password | `password` |
| `mailer_email_from` | Sender address | `"DutyDuke Admin <admin@localhost>"` |

For production, point these to your actual SMTP provider (e.g., Amazon SES, SendGrid, Mailgun).

## Notifications Service (Optional)

| Variable | Description | Default |
|----------|-------------|---------|
| `USE_NOTIFICATIONS_SERVICE` | Enable external notifications | `false` |
| `NOTIFICATIONS_SERVICE_URL` | Notifications API URL | `http://localhost:3001/api/notifications` |
| `NOTIFICATIONS_SERVICE_APPLICATION_NAME` | App name for notifications | `DutyDuke` |
| `NOTIFICATIONS_SERVICE_APPLICATION_TOKEN` | Auth token for notifications | Empty |

## Other

| Variable | Description | Default |
|----------|-------------|---------|
| `SUPPORT_PASSWORD` | Support account password | Set your own |
| `SUGGESTIONS_SLOT_COUNT` | Number of suggestion slots | `3` |
| `NEXT_PUBLIC_MAP_TILES_URL` | Map tile server URL | `tiles_url` |

## Security Notes

- Never commit `.env` to version control (it's in `.gitignore`)
- Always generate unique values for `JWT_SECRET` and `PRISMA_FIELD_ENCRYPTION_KEY` per environment
- Use strong passwords in production
- Set `mailer_smtp_isSecure=true` in production with proper TLS certificates
