import { COMPANY_ERRORS } from '@/api/hris/company/errors';
import { type DocumentsAcl } from '@/api/hris/company/model/acl';
import { type CompanyLogoDto } from '@/api/hris/company/model/dtos';
import { type CompanyLogoRepository } from '@/api/hris/company/model/repositories/company-logo.reposiotry';
import { ApiError } from '@/shared';
import { logger } from '@/shared/service/pino';

export function deleteCompanyLogoUseCase(
  companyLogoRepository: CompanyLogoRepository,
  documentsAcl: DocumentsAcl,
) {
  return async (companyLogo: CompanyLogoDto) => {
    try {
      await companyLogoRepository.deleteCompanyLogo(companyLogo.id);
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, COMPANY_ERRORS.DELETE_LOGO_FAILED);
    }

    try {
      await documentsAcl.deleteCompanyLogo(companyLogo.filePath);
    } catch (err) {
      logger.info(err);
      await companyLogoRepository.createCompanyLogo(companyLogo);
      throw new ApiError(400, COMPANY_ERRORS.DELETE_LOGO_FAILED);
    }
  };
}
