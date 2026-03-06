import { type OrganizationContext } from '@/api/hris';
import { type CUID } from '@/shared';
import { type EquipmentDocumentsRepository } from '../../../model/repository/equipment-documents.repository';

export function equipmentDocumentsRepository(
  organizationContext: OrganizationContext,
): EquipmentDocumentsRepository {
  const { db } = organizationContext;

  const createEquipmentDocument = async (equipmentId: CUID, documentId: string) => {
    await db.equipment.update({
      where: {
        id: equipmentId,
      },
      data: {
        documentIds: {
          push: documentId,
        },
      },
    });
  };

  const deleteEquipmentDocuments = async (equipmentId: CUID, documentIds: CUID[]) => {
    await db.equipment.update({
      where: { id: equipmentId },
      data: {
        documentIds: {
          set: documentIds,
        },
      },
    });
  };

  const deleteAllEquipmentDocuments = async (equipmentId: CUID) => {
    await db.equipment.update({ where: { id: equipmentId }, data: { documentIds: [] } });
  };

  return {
    createEquipmentDocument,
    deleteEquipmentDocuments,
    deleteAllEquipmentDocuments,
  };
}
