import { type CompanyLogoDto } from '@/api/hris/company/model/dtos/company-logo.dtos';
import { type WithoutId, type WithId, type Nullable, type WithAccess } from '@/shared';

export type CompanyDto = WithId<{
  name: string;
  logo: Nullable<CompanyLogoDto>;
}>;

export type CompanyWithAccessDto = WithAccess<CompanyDto, { edit: boolean }>;

export type UpdateCompanyDto = Omit<WithoutId<CompanyDto>, 'logo'>;
export type CreateCompanyDto = Omit<WithoutId<CompanyDto>, 'logo'>;
