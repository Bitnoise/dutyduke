import { type WithId } from '@/shared';

export type CompanyLogoDto = WithId<{
  filePath: string;
}>;

export type CreateCompanyLogoDto = {
  filePath: string;
};

export type UpdateCompanyLogoDto = CreateCompanyLogoDto;
