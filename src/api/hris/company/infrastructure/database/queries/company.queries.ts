import { type CompanyDto } from '@/api/hris/company/model/dtos';
import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';

export function companyQueries(db: OrganizationPrismaClient) {
  const getCompany = async (): Promise<CompanyDto | null> => {
    return db.company.findFirst({ include: { logo: true } });
  };

  const getCompanyId = async () => {
    const company = await db.company.findFirst({ select: { id: true } });

    return company?.id ?? null;
  };

  return {
    getCompany: getCompany,
    getCompanyId: getCompanyId,
  };
}
