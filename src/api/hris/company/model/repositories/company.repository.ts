import { type CreateCompanyDto, type UpdateCompanyDto } from '@/api/hris/company/model/dtos';
import { type Nullable, type CUID } from '@/shared';

export type CompanyRepository = {
  createCompany(company: CreateCompanyDto, logoId?: Nullable<string>): Promise<CUID>;
  updateCompany(id: CUID, company: UpdateCompanyDto, logoId?: Nullable<string>): Promise<void>;
};
