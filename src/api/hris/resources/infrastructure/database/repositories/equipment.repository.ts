import { type EquipmentStatus, type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { serializeEquipment } from '@/api/hris/resources/infrastructure/database/utils';
import { type CreateEquipmentDto, type UpdateEquipmentDto } from '@/api/hris/resources/model/dtos';
import { type EquipmentRepository } from '@/api/hris/resources/model/repository';
import { type Nullable, type CUID } from '@/shared';

export function equipmentRepository(db: OrganizationPrismaClient): EquipmentRepository {
  const equipmentDtoInclude = {
    category: true,
  };

  const createEquipment = async (
    categoryId: CUID,
    locationId: Nullable<CUID>,
    equipment: Omit<CreateEquipmentDto, 'documents' | 'photo'>,
  ) => {
    const createdEquipment = await db.equipment.create({
      data: {
        ...equipment,
        category: {
          connect: {
            id: categoryId,
          },
        },
        location: locationId
          ? {
              connect: {
                id: locationId,
              },
            }
          : undefined,
      },
    });

    return createdEquipment.id;
  };

  const getEquipmentBySerial = async (serial: string) => {
    const equipment = await db.equipment.findUnique({ where: { serial }, include: equipmentDtoInclude });

    return serializeEquipment(equipment);
  };

  const getEquipmentBySignature = async (signature: string) => {
    const equipment = await db.equipment.findUnique({ where: { signature }, include: equipmentDtoInclude });

    return serializeEquipment(equipment);
  };

  const deleteEquipment = async (equipmentId: CUID) => {
    await db.equipment.delete({ where: { id: equipmentId } });
  };

  const addEquipmentDocument = async (equipmentId: CUID, documentId: CUID) => {
    const createdDocument = await db.equipment.update({
      where: {
        id: equipmentId,
      },
      data: {
        documentIds: {
          push: documentId,
        },
      },
    });

    return createdDocument.id;
  };

  const updateEquipmentPhotos = async (equipmentId: CUID, photoId: CUID) => {
    await db.equipment.update({
      where: {
        id: equipmentId,
      },
      data: {
        photoIds: {
          push: photoId,
        },
      },
    });
  };

  const updateEquipment = async (equipmentId: CUID, equipment: Omit<UpdateEquipmentDto, 'photo'>) => {
    const updatedEquipment = await db.equipment.update({
      where: { id: equipmentId },
      data: equipment,
      include: equipmentDtoInclude,
    });

    return serializeEquipment(updatedEquipment)!;
  };

  const assignEquipment = async (equipmentId: CUID, assigneeId: CUID) => {
    const updatedEquipment = await db.equipment.update({
      where: { id: equipmentId },
      data: {
        assigneeId,
      },
      include: equipmentDtoInclude,
    });

    return serializeEquipment(updatedEquipment)!;
  };

  const unassignEquipment = async (equipmentId: CUID) => {
    const updatedEquipment = await db.equipment.update({
      where: { id: equipmentId },
      data: {
        assigneeId: null,
      },
      include: equipmentDtoInclude,
    });

    return serializeEquipment(updatedEquipment)!;
  };

  const updateEquipmentCategory = async (equipmentId: CUID, categoryId: CUID) => {
    await db.equipment.update({
      where: { id: equipmentId },
      data: {
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
  };

  const updateEquipmentLocation = async (equipmentId: CUID, locationId: Nullable<CUID>) => {
    if (!locationId) {
      await db.equipment.update({
        where: { id: equipmentId },
        data: {
          location: {
            disconnect: true,
          },
        },
      });

      return;
    }

    await db.equipment.update({
      where: { id: equipmentId },
      data: {
        location: {
          connect: {
            id: locationId,
          },
        },
      },
    });
  };

  const setEquipmentAvatar = async (equipmentId: CUID, avatarId: CUID) => {
    await db.equipment.update({
      where: {
        id: equipmentId,
      },
      data: {
        avatarId,
      },
    });
  };

  const unsetEquipmentAvatar = async (equipmentId: CUID) => {
    await db.equipment.update({
      where: {
        id: equipmentId,
      },
      data: {
        avatarId: null,
      },
    });
  };

  const getEquipmentPhotos = async (equipmentId: CUID) => {
    const equipment = await db.equipment.findUnique({ where: { id: equipmentId } });
    return equipment?.photoIds ?? [];
  };

  /**
   * This function sets the photoIds field of the equipment to the provided photoIds array.It is not removing anything.
   */
  const setEquipmentPhotoIds = async (equipmentId: CUID, photoIds: CUID[]) => {
    await db.equipment.update({
      where: {
        id: equipmentId,
      },
      data: {
        photoIds: {
          set: photoIds,
        },
      },
    });
  };

  const getEquipmentById = async (equipmentId: CUID) => {
    const eq = await db.equipment.findFirst({ where: { id: equipmentId }, include: equipmentDtoInclude });
    return serializeEquipment(eq);
  };

  const updateEquipmentStatus = async (id: CUID, status: EquipmentStatus, description: string) => {
    await db.equipment.update({
      where: {
        id,
      },
      data: {
        status,
        description,
      },
    });
  };

  return {
    createEquipment,
    getEquipmentBySerial,
    getEquipmentBySignature,
    deleteEquipment,
    updateEquipmentPhotos,
    addEquipmentDocument,
    updateEquipment,
    assignEquipment,
    unassignEquipment,
    updateEquipmentCategory,
    updateEquipmentLocation,
    setEquipmentAvatar,
    unsetEquipmentAvatar,
    getEquipmentPhotos,
    setEquipmentPhotoIds,
    getEquipmentById,
    updateEquipmentStatus,
  };
}
