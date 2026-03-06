import { type CUID, type Nullable } from '@/shared';

export type AssigneeInfo = {
  id: CUID;
  fullName: string;
  avatarId: CUID;
};

export type EmployeesAcl = {
  getEmployeeByDocumentId: (documentId: CUID) => Promise<Nullable<AssigneeInfo>>;
};
