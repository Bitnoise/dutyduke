import { type OrganizationContext } from '@/api/hris';
import { type CUID } from '@/shared';

type EmployeeDocumentsQuery = {
  deleteEmployeeDocuments: (employeeId: CUID, documentIds: CUID[]) => Promise<boolean>;
};

export function employeeDocumentsQueries(organizationContext: OrganizationContext): EmployeeDocumentsQuery {
  const { db } = organizationContext;

  const deleteEmployeeDocuments = async (employeeId: CUID, documentIds: CUID[]) => {
    const employee = await db.employee.findUnique({ where: { id: employeeId } });

    if (!employee) return false;

    const docsToLeave = employee.documentIds.filter((id) => !documentIds.includes(id));

    await db.employee.update({
      where: { id: employeeId },
      data: { documentIds: { set: docsToLeave } },
    });

    return true;
  };

  return {
    deleteEmployeeDocuments,
  };
}
