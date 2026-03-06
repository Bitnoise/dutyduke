import { type OrganizationContext } from '@/api/hris';
import { adminAcl, employeesAcl } from '@/api/hris/settings/infrastructure/acl';
import * as queries from '@/api/hris/settings/infrastructure/database/queries';
import { settingsRepository } from '@/api/hris/settings/infrastructure/database/repositories';
import { type UpdateSettingsDto } from '@/api/hris/settings/model/dtos';
import { createSettingsUseCase, deleteOrganizationUseCase } from '@/api/hris/settings/model/use-cases';
import { updateSettingsUseCase } from '@/api/hris/settings/model/use-cases/update-settings.use-case';

export function settingsController(organizationContext: OrganizationContext) {
  const settingsRepositoryImpl = settingsRepository(organizationContext.db);
  const settingsQueriesImpl = queries.settingsQueries(organizationContext.db);

  const adminAclImpl = adminAcl(organizationContext);
  const employeesAclImpl = employeesAcl(organizationContext);

  const upsertSettings = async (settings: UpdateSettingsDto) => {
    const settingsId = await settingsQueriesImpl.getSettingsId();
    if (settingsId) {
      await updateSettingsUseCase(settingsRepositoryImpl)(settingsId, settings);
    } else {
      await createSettingsUseCase(settingsRepositoryImpl)(settings);
    }
  };

  const deleteOrganization = async () => {
    await deleteOrganizationUseCase(adminAclImpl, employeesAclImpl)();
  };

  return {
    ...settingsQueriesImpl,
    ...adminAclImpl,
    upsertSettings,
    deleteOrganization,
  };
}
