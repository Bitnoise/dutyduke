import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';

export function companyLogoQueries(db: OrganizationPrismaClient) {
  const getCompanyLogo = async () => {
    return db.companyLogo.findFirst();
  };

  const getCompanyLogoId = async () => {
    const logo = await db.companyLogo.findFirst();

    return logo?.id ?? null;
  };

  return {
    getCompanyLogoId: getCompanyLogoId,
    getCompanyLogo: getCompanyLogo,
  };
}
