import { ApiError } from '@/shared';
import { SETTINGS_ERRORS } from '@/api/hris/settings/errors';
import { logger } from '@/shared/service/pino';
import { type EmployeesAcl, type AdminAcl } from '../acl';

export function deleteOrganizationUseCase(adminAcl: AdminAcl, employeesAcl: EmployeesAcl) {
  return async () => {
    try {
      await employeesAcl.deleteAllEmployees();
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, SETTINGS_ERRORS.CREATE_FAILED);
    }
    try {
      await adminAcl.deleteOrganization();
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, SETTINGS_ERRORS.DELETE_ORGANIZATION_FAILED);
    }
  };
}
