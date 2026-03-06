import { instantiateHrisApi, type OrganizationContext } from '@/api/hris';
import { type Nullable, type CUID } from '@/shared';
import { type AssigneeInfo, type EmployeesAcl } from '../../model/acl/employees.acl';

export function employeesAcl(organizationContext: OrganizationContext): EmployeesAcl {
  const getEmployeeByDocumentId = async (documentId: CUID): Promise<Nullable<AssigneeInfo>> => {
    const api = instantiateHrisApi(organizationContext);

    const employee = await api.employees.getEmployeeByDocumentId(documentId);

    if (!employee) return null;

    return {
      id: employee.id,
      fullName: `${employee.firstName} ${employee.lastName}`,
      avatarId: employee.avatarId ?? '',
    };
  };

  return {
    getEmployeeByDocumentId,
  };
}
