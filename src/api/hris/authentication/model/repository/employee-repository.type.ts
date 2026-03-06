import { type EmployeeDto, type CreateEmployeeDto } from '@/api/hris/authentication/model/dtos/employee.dto';
import { type EmployeeStatusDto } from '@/api/hris/employees/model/dtos';
import { type CUID } from '@/shared';

export type EmployeeRepository = {
  createEmployee: (employee: CreateEmployeeDto) => Promise<void>;
  getEmployeeByEmail: (email: string) => Promise<EmployeeDto>;
  changeStatus: (employeeId: CUID, status: EmployeeStatusDto) => Promise<void>;
};
