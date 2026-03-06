import { type EmployeeRepository } from '@/api/hris/authentication/model/repository/employee-repository.type';
import { type CreateEmployeeDto } from '@/api/hris/authentication/model/dtos/employee.dto';
import { instantiateHrisApi, type OrganizationContext } from '@/api/hris';
import { type EmployeeStatusDto } from '@/api/hris/employees/model/dtos';

export function employeeAcl(organizationContext: OrganizationContext): EmployeeRepository {
  return {
    changeStatus: async (employeeId: string, status: EmployeeStatusDto) => {
      const hrisApi = instantiateHrisApi(organizationContext);

      await hrisApi.employees.updateEmployeeStatus(employeeId, status);
    },

    createEmployee: async (employee: CreateEmployeeDto) => {
      const hrisApi = instantiateHrisApi(organizationContext);
      const { email, ...restEmployee } = employee;

      await hrisApi.employees.createEmployee({
        workEmail: email,
        ...restEmployee,
      });
    },

    getEmployeeByEmail: async (email: string) => {
      const hrisApi = instantiateHrisApi(organizationContext);

      const employee = await hrisApi.employees.getEmployeeByEmail(email);

      return {
        id: employee.id,
        email,
        firstName: employee.firstName,
        lastName: employee.lastName,
        avatarId: employee.avatarId,
        status: employee.status,
      };
    },
  };
}
