import { type CUID } from '@/shared';
import { type UpdateDocumentDto } from '../dtos';

export type DocumentsRepository = {
  createDocument: (filePath: string, assignedTo?: string, categoryId?: string) => Promise<string>;
  updateDocument: (id: CUID, data: UpdateDocumentDto) => Promise<void>;
  deleteDocumentById: (id: CUID) => Promise<void>;
  deleteDocuments: (ids: CUID[]) => Promise<void>;
};
