import { prisma } from '@/api/hris/prisma/client';

/**
 * Get organization name
 * In single-organization setup, returns the name of the single organization
 */
export async function getOrganizationNameAcl(): Promise<string | null> {
  // Single organization - get the first (and only) organization
  const organization = await prisma.organization.findFirst({
    select: {
      name: true,
    },
  });

  return organization?.name ?? null;
}
