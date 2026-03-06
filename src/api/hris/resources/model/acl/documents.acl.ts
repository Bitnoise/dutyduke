import { type DocumentDto } from '@/api/hris/documents/model/dtos';
import { type Nullable, type CUID, type OrderBy, type Paginated } from '@/shared';
import { type UpdateEquipmentDocumentDto } from '../dtos';

export type DocumentsAcl = {
  uploadEquipmentDocument(equipmentId: CUID, document: File): Promise<string | null>;
  uploadEquipmentPhoto(equipmentId: CUID, photo: File): Promise<string | null>;
  deleteEquipmentFileById(id: string): Promise<void>;
  getDocumentById: (id: CUID) => Promise<Nullable<DocumentDto>>;
  getDocuments: (
    ids: string[],
    page: number,
    orderBy?: Extract<OrderBy, 'createdAt-asc' | 'createdAt-desc' | 'expDate-asc' | 'expDate-desc'>,
    perPage?: number,
  ) => Promise<Paginated<DocumentDto>>;
  deleteEquipmentDocuments: (documentIds: CUID[]) => Promise<void>;
  updateEquipmentDocument: (id: CUID, document: UpdateEquipmentDocumentDto) => Promise<void>;
};
