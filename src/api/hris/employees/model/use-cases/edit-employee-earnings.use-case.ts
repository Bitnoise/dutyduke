import { EMPLOYEE_EARNINGS_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { ApiError, type CUID } from '@/shared';

import { type EmployeeEarningsRepository } from '@/api/hris/employees/model/repositories';
import { type UpdateEmployeeEarningsDto } from '../dtos';

export function editEmployeeEarningsUseCase(employeeEarningsRepository: EmployeeEarningsRepository) {
  return async (earningId: CUID, earnings: UpdateEmployeeEarningsDto) => {
    try {
      employeeEarningsRepository.editEarnings(earningId, earnings);
    } catch {
      throw new ApiError(400, EMPLOYEE_EARNINGS_ERROR_MESSAGES.UPDATE_FAILED);
    }
  };
}
