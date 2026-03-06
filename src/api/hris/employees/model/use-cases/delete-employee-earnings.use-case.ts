import { EMPLOYEE_EARNINGS_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { type EmployeeEarningsRepository } from '@/api/hris/employees/model/repositories';
import { ApiError, type CUID } from '@/shared';

export function deleteEmployeeEarningsUseCase(employeeEarningsRepository: EmployeeEarningsRepository) {
  return async (id: CUID) => {
    try {
      employeeEarningsRepository.deleteEarnings(id);
    } catch {
      throw new ApiError(400, EMPLOYEE_EARNINGS_ERROR_MESSAGES.DELETE_FAILED);
    }
  };
}
