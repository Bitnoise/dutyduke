import { type CUID } from '@/shared';

export type EquipmentDocumentsRepository = {
  createEquipmentDocument: (equipmentId: CUID, documentId: string) => Promise<void>;
  deleteEquipmentDocuments: (equipmentId: CUID, documentIds: CUID[]) => Promise<void>;
  deleteAllEquipmentDocuments: (equipmentId: CUID) => Promise<void>;
};
