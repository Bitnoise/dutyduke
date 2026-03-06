import { prisma } from '@/api/hris/prisma/client';

async function createOrganization(name: string): Promise<void> {
  console.log('🏢 Creating organization...');

  // Check if organization with this name already exists
  const existingOrganization = await prisma.organization.findFirst({
    where: { name },
  });

  if (existingOrganization) {
    throw new Error(`Organization with name "${name}" already exists`);
  }

  // Create organization
  const organization = await prisma.organization.create({
    data: {
      name,
      foundedAt: new Date(),
    },
  });

  console.log('✅ Organization created');
  console.log('\n🎉 Organization created successfully!');
  console.log(`🆔 ID: ${organization.id}`);
  console.log(`📛 Name: ${organization.name}`);
  console.log(`📅 Founded: ${organization.foundedAt?.toISOString() || 'N/A'}`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('❌ Usage:');
    console.error('  tsx src/api/hris/scripts/create-organization.ts <name>');
    console.error('Example: tsx src/api/hris/scripts/create-organization.ts "My Company"');
    process.exit(1);
  }

  const name = args[0];

  // Basic validation
  if (!name || name.trim().length === 0) {
    console.error('❌ Organization name is required');
    process.exit(1);
  }

  try {
    await createOrganization(name.trim());
  } catch (error) {
    console.error('❌ Failed to create organization:', error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
