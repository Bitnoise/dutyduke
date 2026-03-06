import { COMPANY_ERRORS } from '@/api/hris/company/errors';
import { type UpdateCompanyDto } from '@/api/hris/company/model/dtos';
import { type CompanyRepository } from '@/api/hris/company/model/repositories';
import { ApiError, type Nullable, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function updateCompanyUseCase(companyRepository: CompanyRepository) {
  return async (id: CUID, company: UpdateCompanyDto, logoId: Nullable<string | undefined>) => {
    try {
      await companyRepository.updateCompany(id, company, logoId);
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, COMPANY_ERRORS.UPDATE_FAILED);
    }
  };
}
