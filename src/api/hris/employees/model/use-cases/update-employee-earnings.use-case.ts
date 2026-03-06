import { EMPLOYEE_EARNINGS_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { ApiError } from '@/shared';
import { type EmployeeEarningsRepository } from '@/api/hris/employees/model/repositories';
import { type UpdateEmployeeEarningsDto } from '../dtos';

export function updateEmployeeEarningsUseCase(employeeEarningsRepository: EmployeeEarningsRepository) {
  return async (earnings: UpdateEmployeeEarningsDto) => {
    try {
      employeeEarningsRepository.updateEarnings(earnings);
    } catch {
      throw new ApiError(400, EMPLOYEE_EARNINGS_ERROR_MESSAGES.UPDATE_FAILED);
    }
  };
}
