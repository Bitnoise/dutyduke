import { instantiateHrisApi, type OrganizationContext } from '@/api/hris';
import { type CUID } from '@/shared';

export function employeesAcl(organizationContext: OrganizationContext) {
  const getEmployeeById = async (employeeId: CUID) => {
    const api = instantiateHrisApi(organizationContext);

    const employee = await api.employees.getEmployeeById(employeeId);

    if (!employee) return null;

    return {
      id: employee.id,
      fullName: `${employee.firstName} ${employee.lastName}`,
      avatarId: employee.avatarId,
    };
  };

  const validateEmployeeStatus = async (employeeId: CUID) => {
    const api = instantiateHrisApi(organizationContext);

    await api.employees.validateEmployeeStatus(employeeId);
  };

  return {
    getEmployeeById,
    validateEmployeeStatus,
  };
}
