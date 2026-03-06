import { instantiateHrisApi, type OrganizationContext } from '@/api/hris';
import { type CUID } from '@/shared';
import { type EmployeesAcl } from '../../model/acl/employee.acl';

export function employeesAcl(organizationContext: OrganizationContext): EmployeesAcl {
  const getEmployeeById = async (id: CUID) => {
    const api = instantiateHrisApi(organizationContext);

    const employee = await api.employees.getEmployeeById(id);

    return employee;
  };

  const getEmployeeIdsBySkillIds = async (skillIds: CUID[]) => {
    const api = instantiateHrisApi(organizationContext);

    const employeeIds = await api.employees.getEmployeeBySkillIds(skillIds);

    if (!employeeIds.length) return [];
    return employeeIds;
  };

  const getAllEmployeesIds = async () => {
    const api = instantiateHrisApi(organizationContext);

    const employees = await api.employees.getAllEmployees();

    if (!employees.length) return [];
    const ids = employees.map((employee) => employee.id);

    return ids;
  };

  const getEmployeesById = async (ids: CUID[]) => {
    const api = instantiateHrisApi(organizationContext);

    return api.employees.getEmployeesById(ids);
  };
  const getAllEmployees = async () => {
    const api = instantiateHrisApi(organizationContext);

    return api.employees.getAllEmployees();
  };

  return {
    getEmployeeById,
    getEmployeeIdsBySkillIds,
    getAllEmployeesIds,
    getEmployeesById,
    getAllEmployees,
  };
}
