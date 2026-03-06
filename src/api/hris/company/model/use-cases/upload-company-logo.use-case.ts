import { type CompanyLogoRepository } from '@/api/hris/company/model/repositories/company-logo.reposiotry';
import { COMPANY_ERRORS } from '@/api/hris/company/errors';
import { type DocumentsAcl } from '@/api/hris/company/model/acl';
import { ApiError, type Nullable } from '@/shared';
import { logger } from '@/shared/service/pino';

export function uploadCompanyLogoUseCase(
  companyLogoRepository: CompanyLogoRepository,
  documentsAcl: DocumentsAcl,
) {
  return async (logo: File) => {
    let logoFilePath: Nullable<string> = null;

    try {
      logoFilePath = await documentsAcl.uploadCompanyLogo(logo);
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, COMPANY_ERRORS.UPDATE_LOGO_FAILED);
    }

    if (!logoFilePath) {
      throw new ApiError(400, COMPANY_ERRORS.UPDATE_LOGO_FAILED);
    }

    try {
      const logoId = await companyLogoRepository.createCompanyLogo({
        filePath: logoFilePath,
      });

      return logoId;
    } catch (err) {
      logger.info(err);
      await documentsAcl.deleteCompanyLogo(logoFilePath);
      throw new ApiError(400, COMPANY_ERRORS.UPDATE_LOGO_FAILED);
    }
  };
}
