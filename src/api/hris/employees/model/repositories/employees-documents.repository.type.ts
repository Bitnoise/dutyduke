import { type CUID } from '@/shared';

export type EmployeesDocumentsRepository = {
  createEmployeeDocument: (employeeId: CUID, id: CUID) => Promise<void>;
  deleteEmployeeDocuments: (employeeId: CUID, documentIds: CUID[]) => Promise<void>;
  deleteAllEmployeeDocuments: (employeeId: CUID) => Promise<void>;
};
