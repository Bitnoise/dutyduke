import { type OrganizationContext } from '@/api/hris';
import { requirePermission, privateRoute, type PermissionChecker } from '@/api/hris/authorization';
import { ResourceType, PermissionAction } from '@/api/hris/authorization/permissions';
import { documentsAcl, organizationAcl } from '@/api/hris/company/acl';
import { COMPANY_ERRORS } from '@/api/hris/company/errors';
import { type UpsertCompanySchema } from '@/api/hris/company/infrastructure/controllers/schemas';
import { companyLogoQueries, companyQueries } from '@/api/hris/company/infrastructure/database/queries';
import {
  companyLogoRepository,
  companyRepository,
} from '@/api/hris/company/infrastructure/database/repositories';
import {
  createCompanyUseCase,
  deleteCompanyLogoUseCase,
  updateCompanyUseCase,
  uploadCompanyLogoUseCase,
} from '@/api/hris/company/model/use-cases';
import { ApiError, type Nullable } from '@/shared';
import { type CompanyWithAccessDto } from '../../model/dtos';

export function companyController(organizationContext: OrganizationContext) {
  const companyRepositoryImpl = companyRepository(organizationContext.db, organizationContext.organizationId);
  const companyQueriesImpl = companyQueries(organizationContext.db);

  const companyLogoRepositoryImpl = companyLogoRepository(organizationContext.db);
  const companyLogoQueriesImpl = companyLogoQueries(organizationContext.db);

  const documentsAclImpl = documentsAcl();
  const organizationAclImpl = organizationAcl();

  const upsertCompany = async (checker: PermissionChecker, company: UpsertCompanySchema) => {
    // Check if user can edit company settings
    const canEdit = checker.can(ResourceType.COMPANY_SETTINGS, PermissionAction.EDIT);
    if (!canEdit) {
      throw new ApiError(403, 'Forbidden: No permission to update company settings');
    }

    const currentCompany = await companyQueriesImpl.getCompany();

    const { logo: newLogo, logoId: currentLogoId, ...restCompany } = company;

    let logoId: Nullable<string> = currentLogoId;

    const isTheSameLogo = currentCompany?.logo?.id === currentLogoId;

    if (
      !isTheSameLogo &&
      ((currentCompany?.logo && !newLogo) || (currentCompany?.logo && newLogo instanceof File))
    ) {
      await deleteCompanyLogoUseCase(companyLogoRepositoryImpl, documentsAclImpl)(currentCompany.logo);
    }

    if (newLogo instanceof File && newLogo.size > 0) {
      logoId = await uploadCompanyLogoUseCase(companyLogoRepositoryImpl, documentsAclImpl)(newLogo);
    }

    if (currentCompany) {
      await updateCompanyUseCase(companyRepositoryImpl)(currentCompany.id, restCompany, logoId);
    } else {
      await createCompanyUseCase(companyRepositoryImpl)(restCompany, logoId);
    }
  };

  const getCompanyLogo = async (_checker: PermissionChecker) => {
    const logo = await companyLogoQueriesImpl.getCompanyLogo();

    if (!logo) {
      throw new ApiError(404, COMPANY_ERRORS.LOGO_NOT_FOUND);
    }

    return logo;
  };

  const getDefaultCompanyName = async (_checker: PermissionChecker) => {
    // Single organization - get default name without subdomain
    const organizationName = organizationAclImpl.getOrganizationName();

    if (!organizationName) {
      throw new ApiError(404, COMPANY_ERRORS.ORGANIZATION_NOT_FOUND);
    }

    return organizationName;
  };

  const getCompany = async (checker: PermissionChecker): Promise<CompanyWithAccessDto> => {
    // Check if user can view company settings
    const canView = checker.can(ResourceType.COMPANY_SETTINGS, PermissionAction.VIEW);
    if (!canView) {
      throw new ApiError(403, 'Forbidden: No permission to view company settings');
    }

    const canEdit = checker.can(ResourceType.COMPANY_SETTINGS, PermissionAction.EDIT);

    const company = await companyQueriesImpl.getCompany();
    const defaultCompanyName = await getDefaultCompanyName(checker);

    return {
      id: company?.id ?? '',
      name: company?.name ?? defaultCompanyName!,
      logo: company?.logo ?? null,
      _access: {
        edit: canEdit,
      },
    };
  };

  const getCompanyId = async () => {
    const company = await companyQueriesImpl.getCompany();
    return company?.id ?? '';
  };

  const getCompanyLogoId = async (_checker: PermissionChecker) => {
    const id = await companyLogoQueriesImpl.getCompanyLogoId();
    return id ?? '';
  };

  return {
    getCompany: privateRoute(getCompany),
    getCompanyId: getCompanyId,
    getDefaultCompanyName: privateRoute(getDefaultCompanyName),
    upsertCompany: requirePermission(ResourceType.COMPANY_SETTINGS, PermissionAction.EDIT, upsertCompany),
    getCompanyLogo: privateRoute(getCompanyLogo),
    getCompanyLogoId: privateRoute(getCompanyLogoId),
  };
}
