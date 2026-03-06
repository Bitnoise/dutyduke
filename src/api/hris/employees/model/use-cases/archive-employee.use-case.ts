import { type EmployeeRepository } from '@/api/hris/employees/model/repositories';
import { type CUID } from '@/shared';

export function archiveEmployeeUseCase(employeeRepository: EmployeeRepository) {
  return async (employeeId: CUID) => {
    await employeeRepository.updateStatus(employeeId, 'ARCHIVED');
  };
}
