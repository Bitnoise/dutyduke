# User Management

DutyDuke provides CLI commands for managing users. Since there is no self-registration, the first user must be created via the command line.

## Create Owner (Admin)

Create a new user with the OWNER role (full system access):

```bash
yarn create:owner <email> <password> <firstName> <lastName>
```

Example:
```bash
yarn create:owner admin@example.com SecurePass123 John Doe
```

This will:
- Create the OWNER role if it doesn't exist
- Create a new identity (user account)
- Assign the OWNER role with all permissions
- Create an employee record linked to the identity

Requirements:
- Valid email address
- Password at least 6 characters
- First and last name required

## Promote to Owner

Promote an existing user to OWNER role:

```bash
yarn promote:owner <email>
```

Example:
```bash
yarn promote:owner user@example.com
```

The user must already exist in the system. If they already have the OWNER role, the command completes without error.

## Change Password

Reset a user's password:

```bash
yarn change:password <email> <newPassword>
```

Example:
```bash
yarn change:password user@example.com NewSecurePass123
```

Does not require the old password. Useful for account recovery.

## Fix Email Hash

Regenerate the email hash for a user (useful after schema changes):

```bash
yarn create:owner fix-email-hash <email>
```

## Create Organization

Create or update the organization record:

```bash
yarn organization:create <name>
```

## Load Demo Data

Load fixture data for testing and demonstration:

```bash
yarn fixtures:load            # Load demo data (skips existing records)
yarn fixtures:load --clean    # Clean and reload all demo data
```

All fixture records use IDs prefixed with `fix-` for easy identification and cleanup.

## Managing Users via UI

After the initial admin account is created, additional users can be managed through the application:

1. Navigate to **Employees** and create a new employee record
2. In the employee's **General** tab, use the **Application Access** section to:
   - Create an identity (email + temporary password)
   - Assign roles
   - Send an invitation email
   - Revoke access if needed

## Roles

DutyDuke comes with one system role:

- **OWNER** — full access to all resources and actions (cannot be modified or deleted)

Additional custom roles can be created through **Settings > Roles** in the UI. See [RBAC architecture](../architecture/rbac.md) for details on the permission system.
