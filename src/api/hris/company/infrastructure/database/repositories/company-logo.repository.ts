import { type CreateCompanyLogoDto, type UpdateCompanyLogoDto } from '@/api/hris/company/model/dtos';
import { type CompanyLogoRepository } from '@/api/hris/company/model/repositories/company-logo.reposiotry';
import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { type CUID } from '@/shared';

export function companyLogoRepository(db: OrganizationPrismaClient): CompanyLogoRepository {
  const createCompanyLogo = async (companyLogo: CreateCompanyLogoDto) => {
    const logo = await db.companyLogo.create({
      data: companyLogo,
    });

    return logo.id;
  };

  const updateCompanyLogo = async (id: CUID, companyLogo: UpdateCompanyLogoDto) => {
    await db.companyLogo.update({
      data: companyLogo,
      where: { id },
    });
  };

  const deleteCompanyLogo = async (id: CUID) => {
    await db.companyLogo.delete({ where: { id } });
  };

  return {
    createCompanyLogo,
    updateCompanyLogo,
    deleteCompanyLogo,
  };
}
