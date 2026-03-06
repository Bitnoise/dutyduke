import { type CreateEmployeeDto } from '@/api/hris/employees/model/dtos';
import { type EmployeeRepository } from '@/api/hris/employees/model/repositories';

export function createEmployeeUseCase(repository: EmployeeRepository) {
  return async (employee: CreateEmployeeDto) => repository.createEmployee(employee);
}
