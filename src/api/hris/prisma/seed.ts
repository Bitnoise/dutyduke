import {
  type ResourceType,
  type PermissionAction,
  PermissionScope,
} from '../../../../.prisma-generated/organization-client';
import { prisma } from './client';

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default organization
  const organization = await prisma.organization.upsert({
    where: { id: 'default-org-id' },
    update: {},
    create: {
      id: 'default-org-id',
      name: process.env.ORGANIZATION_NAME || 'DutyDuke',
      taxId: process.env.ORGANIZATION_TAX_ID || null,
      foundedAt: new Date(),
    },
  });

  console.log('✅ Default organization created:', organization.name);

  // Create OWNER role if not exists
  const ownerRole = await prisma.role.upsert({
    where: { key: 'OWNER' },
    update: {},
    create: {
      key: 'OWNER',
      name: 'Owner',
      description: 'Full system access with all permissions',
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

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
