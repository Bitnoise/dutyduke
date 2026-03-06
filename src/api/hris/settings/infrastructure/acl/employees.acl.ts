import { instantiateHrisApi, type OrganizationContext } from '@/api/hris';
import { type EmployeesAcl } from '@/api/hris/settings/model/acl';

export function employeesAcl(organizationContext: OrganizationContext): EmployeesAcl {
  const deleteAllEmployees = async () => {
    const api = instantiateHrisApi(organizationContext);

    await api.employees.deleteAllEmployees();
  };
  return {
    deleteAllEmployees,
  };
}
