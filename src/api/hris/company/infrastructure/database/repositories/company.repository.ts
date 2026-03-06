import { type UpdateCompanyDto, type CreateCompanyDto } from '@/api/hris/company/model/dtos';
import { type CompanyRepository } from '@/api/hris/company/model/repositories';
import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { type Nullable, type CUID } from '@/shared';

export function companyRepository(db: OrganizationPrismaClient, organizationId: string): CompanyRepository {
  const createCompany = async (company: CreateCompanyDto, logoId: Nullable<string>) => {
    const createdCompany = await db.company.create({
      data: {
        ...company,
        organizationId,
        logoId,
      },
    });

    return createdCompany.id;
  };

  const updateCompany = async (id: CUID, company: UpdateCompanyDto, logoId: Nullable<string | undefined>) => {
    await db.company.update({ data: { ...company, logoId }, where: { id } });
  };

  return {
    createCompany,
    updateCompany,
  };
}
