import { COMPANY_ERRORS } from '@/api/hris/company/errors';
import { type CreateCompanyDto } from '@/api/hris/company/model/dtos';
import { type CompanyRepository } from '@/api/hris/company/model/repositories';
import { ApiError, type Nullable } from '@/shared';
import { logger } from '@/shared/service/pino';

export function createCompanyUseCase(companyRepository: CompanyRepository) {
  return async (company: CreateCompanyDto, logoId?: Nullable<string>) => {
    try {
      await companyRepository.createCompany(company, logoId);
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, COMPANY_ERRORS.CREATE_FAILED);
    }
  };
}
