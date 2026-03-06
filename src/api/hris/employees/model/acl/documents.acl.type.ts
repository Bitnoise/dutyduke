import { type DocumentDto } from '@/api/hris/documents/model/dtos';
import { type Nullable, type CUID, type OrderBy, type Paginated } from '@/shared';
import { type EmployeeCVPayload } from '@/templates/pdf/cv';
import { type UpdateEmployeeDocumentDto } from '../dtos';

export type DocumentsAcl = {
  getEmployeeCvPdfBuffer: (cvTemplateVariables: EmployeeCVPayload) => Promise<Buffer>;
  uploadEmployeeDocument: (file: File, dirPath?: string) => Promise<string | null>;
  deleteEmployeeDocumentByFilePath: (filePath: string) => Promise<boolean>;
  deleteEmployeeDocuments: (documentIds: CUID[]) => Promise<void>;
  getDocuments: (
    ids: string[],
    page: number,
    orderBy?: Extract<OrderBy, 'createdAt-asc' | 'createdAt-desc' | 'expDate-asc' | 'expDate-desc'>,
  ) => Promise<Paginated<DocumentDto>>;
  getDocumentById: (id: CUID) => Promise<Nullable<DocumentDto>>;
  deleteDocumentById: (documentId: CUID) => Promise<void>;
  deleteEmployeeDirectory: (dirPath: string, force?: boolean) => Promise<boolean>;
  updateEmployeeDocument: (id: CUID, document: UpdateEmployeeDocumentDto) => Promise<void>;
  getDocumentByFilePath: (filePath: string) => Promise<Nullable<DocumentDto>>;
};
