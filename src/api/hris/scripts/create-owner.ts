import { authenticationService } from '@/api/hris/authentication/infrastructure/service/authentication.service';
import { identityRepository } from '@/api/hris/authentication/infrastructure/database/repositories/identityRepository';
import { rolesRepository } from '@/api/hris/authentication/infrastructure/database/repositories/rolesRepository';
import { prisma } from '@/api/hris/prisma/client';
import {
  type ResourceType,
  type PermissionAction,
  PermissionScope,
  EmployeeStatus,
} from '../../../../.prisma-generated/organization-client';

async function ensureOwnerRoleExists(): Promise<void> {
  // Check if OWNER role already exists
  const existingOwner = await prisma.role.findUnique({
    where: { key: 'OWNER' },
  });

  if (existingOwner) {
    console.log('✅ OWNER role already exists');
    return;
  }

  console.log('🌱 Creating OWNER role...');

  // Create OWNER role
  const ownerRole = await prisma.role.create({
    data: {
      name: 'Owner',
      key: 'OWNER',
      description: 'System role with full access to all resources',
      isSystem: true,
    },
  });

  console.log('✅ OWNER role created');

  // Define all resources and their permissions for OWNER
  const resources: ResourceType[] = [
    'EMPLOYEES',
    'COMPANY_ABSENCES',
    'COMPANY_DOCUMENTS',
    'COMPANY_EQUIPMENT',
    'COMPANY_BENEFITS',
    'COMPANY_SETTINGS',
    'EMPLOYEE_PROFILE',
    'EMPLOYEE_DOCUMENTS',
    'EMPLOYEE_EQUIPMENT',
    'EMPLOYEE_ABSENCES',
    'EMPLOYEE_FEEDBACK',
    'EMPLOYEE_EARNINGS',
  ];

  const allActions: PermissionAction[] = ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'ASSIGN', 'EXPORT'];

  // Create permissions for OWNER role
  for (const resource of resources) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_resource: {
          roleId: ownerRole.id,
          resource: resource,
        },
      },
      update: {},
      create: {
        roleId: ownerRole.id,
        resource: resource,
        actions: allActions,
        scope: PermissionScope.ALL,
      },
    });
  }

  console.log('✅ OWNER role permissions configured');
}

async function createOwnerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<void> {
  console.log('🔐 Creating owner user...');

  // Ensure OWNER role exists
  await ensureOwnerRoleExists();

  // Initialize repositories and services
  const authService = authenticationService();
  const identityRepo = identityRepository(prisma);
  const rolesRepo = rolesRepository(prisma);

  // Check if identity already exists
  const existingIdentity = await identityRepo.findIdentityByEmail(email);
  if (existingIdentity) {
    throw new Error(`User with email ${email} already exists`);
  }

  // Hash password
  const hashedPassword = await authService.hashPassword(password);

  // Create identity
  const identityId = await identityRepo.createIdentity({
    email,
    password: hashedPassword,
  });

  console.log('✅ Identity created');

  // Assign OWNER role
  await rolesRepo.addRoleByKey(identityId, 'OWNER');
  console.log('✅ OWNER role assigned');

  // Create employee record directly via Prisma
  await prisma.employee.create({
    data: {
      identityId,
      firstName,
      lastName,
      workEmail: email,
      status: EmployeeStatus.ACTIVE,
    },
  });

  console.log('✅ Employee record created');

  console.log('\n🎉 Owner user created successfully!');
  console.log(`📧 Email: ${email}`);
  console.log(`👤 Name: ${firstName} ${lastName}`);
  console.log(`🔑 Role: OWNER`);
}

async function fixEmailHash(email: string): Promise<void> {
  console.log('🔧 Fixing emailHash for existing identity...');

  const identity = await prisma.identity.findFirst({
    where: { email },
  });

  if (!identity) {
    throw new Error(`Identity with email ${email} not found`);
  }

  // Update email with the same value to trigger emailHash generation
  await prisma.identity.update({
    where: { id: identity.id },
    data: { email }, // Same email, but this will trigger the extension to generate emailHash
  });

  console.log('✅ emailHash generated successfully');
}

async function promoteEmployeeToOwner(email: string, password: string): Promise<void> {
  console.log(`🔐 Promoting employee with email ${email} to OWNER...`);

  // Ensure OWNER role exists
  await ensureOwnerRoleExists();

  // Initialize repositories and services
  const authService = authenticationService();
  const identityRepo = identityRepository(prisma);
  const rolesRepo = rolesRepository(prisma);

  // Find employee by workEmail
  const employee = await prisma.employee.findFirst({
    where: { workEmail: email },
  });

  if (!employee) {
    throw new Error(`Employee with email ${email} not found`);
  }

  console.log(`✅ Found employee: ${employee.firstName} ${employee.lastName}`);

  // Check if employee already has an identity
  if (employee.identityId) {
    const existingIdentity = await identityRepo.getIdentityById(employee.identityId);
    if (existingIdentity) {
      // Check if identity already has OWNER role
      const payload = existingIdentity.getPayload();
      const hasOwnerRole = payload.roles.includes('OWNER');
      if (hasOwnerRole) {
        console.log('✅ Employee already has OWNER role');
        return;
      }

      // Assign OWNER role to existing identity
      await rolesRepo.addRoleByKey(employee.identityId, 'OWNER');
      console.log('✅ OWNER role assigned to existing identity');
      console.log('\n🎉 Employee promoted to OWNER successfully!');
      console.log(`📧 Email: ${email}`);
      console.log(`👤 Name: ${employee.firstName} ${employee.lastName}`);
      console.log(`🔑 Role: OWNER`);
      return;
    }
  }

  // Check if identity with this email already exists
  const existingIdentity = await identityRepo.findIdentityByEmail(email);
  if (existingIdentity) {
    // Link employee to existing identity and assign OWNER role
    const identityId = existingIdentity.getId();
    await prisma.employee.update({
      where: { id: employee.id },
      data: { identityId },
    });
    await rolesRepo.addRoleByKey(identityId, 'OWNER');
    console.log('✅ Linked employee to existing identity and assigned OWNER role');
    console.log('\n🎉 Employee promoted to OWNER successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Name: ${employee.firstName} ${employee.lastName}`);
    console.log(`🔑 Role: OWNER`);
    return;
  }

  // Create new identity
  const hashedPassword = await authService.hashPassword(password);
  const identityId = await identityRepo.createIdentity({
    email,
    password: hashedPassword,
  });

  console.log('✅ Identity created');

  // Assign OWNER role
  await rolesRepo.addRoleByKey(identityId, 'OWNER');
  console.log('✅ OWNER role assigned');

  // Update employee record with identityId
  await prisma.employee.update({
    where: { id: employee.id },
    data: { identityId },
  });

  console.log('✅ Employee record updated with identityId');

  console.log('\n🎉 Employee promoted to OWNER successfully!');
  console.log(`📧 Email: ${email}`);
  console.log(`👤 Name: ${employee.firstName} ${employee.lastName}`);
  console.log(`🔑 Role: OWNER`);
}

async function main() {
  const args = process.argv.slice(2);

  // Check if this is a fix command
  if (args[0] === 'fix-email-hash' && args.length === 2) {
    const email = args[1];
    try {
      await fixEmailHash(email);
      console.log('\n🎉 Email hash fixed successfully!');
    } catch (error) {
      console.error('❌ Failed to fix email hash:', error instanceof Error ? error.message : error);
      process.exit(1);
    } finally {
      await prisma.$disconnect();
    }
    return;
  }

  // Check if this is a promote command
  if (args[0] === 'promote' && args.length === 3) {
    const email = args[1];
    const password = args[2];

    // Basic validation
    if (!email || !email.includes('@')) {
      console.error('❌ Invalid email address');
      process.exit(1);
    }

    if (!password || password.length < 6) {
      console.error('❌ Password must be at least 6 characters long');
      process.exit(1);
    }

    try {
      await promoteEmployeeToOwner(email, password);
    } catch (error) {
      console.error(
        '❌ Failed to promote employee to owner:',
        error instanceof Error ? error.message : error,
      );
      process.exit(1);
    } finally {
      await prisma.$disconnect();
    }
    return;
  }

  if (args.length < 4) {
    console.error('❌ Usage:');
    console.error(
      '  Create owner: tsx src/api/hris/scripts/create-owner.ts <email> <password> <firstName> <lastName>',
    );
    console.error('  Promote employee: tsx src/api/hris/scripts/create-owner.ts promote <email> <password>');
    console.error('  Fix emailHash: tsx src/api/hris/scripts/create-owner.ts fix-email-hash <email>');
    console.error('Example: tsx src/api/hris/scripts/create-owner.ts admin@example.com password123 John Doe');
    console.error(
      'Example: tsx src/api/hris/scripts/create-owner.ts promote employee@example.com password123',
    );
    process.exit(1);
  }

  const [email, password, firstName, lastName] = args;

  // Basic validation
  if (!email || !email.includes('@')) {
    console.error('❌ Invalid email address');
    process.exit(1);
  }

  if (!password || password.length < 6) {
    console.error('❌ Password must be at least 6 characters long');
    process.exit(1);
  }

  if (!firstName || !lastName) {
    console.error('❌ First name and last name are required');
    process.exit(1);
  }

  try {
    await createOwnerUser(email, password, firstName, lastName);
  } catch (error) {
    console.error('❌ Failed to create owner user:', error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
