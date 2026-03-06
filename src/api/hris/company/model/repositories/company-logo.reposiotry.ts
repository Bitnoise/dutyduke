import { type CreateCompanyLogoDto, type UpdateCompanyLogoDto } from '@/api/hris/company/model/dtos';
import { type CUID } from '@/shared';

export type CompanyLogoRepository = {
  createCompanyLogo(companyLogo: CreateCompanyLogoDto): Promise<CUID>;
  updateCompanyLogo(id: CUID, companyLogo: UpdateCompanyLogoDto): Promise<void>;
  deleteCompanyLogo(id: CUID): Promise<void>;
};
