import { type OrganizationContext } from '@/api/hris';
import { type EmployeesDocumentsRepository } from '@/api/hris/employees/model/repositories';
import { type CUID } from '@/shared';

export function employeesDocumentsRepository(
  organizationContext: OrganizationContext,
): EmployeesDocumentsRepository {
  const { db } = organizationContext;

  const createEmployeeDocument = async (employeeId: CUID, id: CUID) => {
    await db.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        documentIds: {
          push: id,
        },
      },
    });
  };

  const deleteEmployeeDocuments = async (employeeId: CUID, documentIds: CUID[]) => {
    await db.employee.update({
      where: { id: employeeId },
      data: { documentIds: { set: documentIds } },
    });
  };

  const deleteAllEmployeeDocuments = async (id: CUID) => {
    await db.employee.update({ where: { id }, data: { documentIds: [] } });
  };

  return {
    createEmployeeDocument,
    deleteEmployeeDocuments,
    deleteAllEmployeeDocuments,
  };
}
