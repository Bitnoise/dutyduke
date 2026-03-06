import { EMPLOYEE_SKILLS_ERROR_MESSAGES } from '@/api/hris/employees/errors';

import { type EmployeeStatusDto } from '@/api/hris/employees/model/dtos';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type EmployeeRepository } from '../repositories';

export function updateEmployeeStatusUseCase(employeeUpdateStatus: EmployeeRepository) {
  return async (employeeId: CUID, status: EmployeeStatusDto) => {
    try {
      await employeeUpdateStatus.updateStatus(employeeId, status);
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, EMPLOYEE_SKILLS_ERROR_MESSAGES.UPDATE_FAILED);
    }
  };
}
