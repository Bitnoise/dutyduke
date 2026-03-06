import { EQUIPMENT_ERRORS } from '@/api/hris/resources/errors';
import { type DocumentsAcl } from '@/api/hris/resources/model/acl';
import { type CreateEquipmentDto } from '@/api/hris/resources/model/dtos';
import { type EquipmentRepository } from '@/api/hris/resources/model/repository';
import { ApiError, type Nullable, type CUID, API_ERROR_MESSAGES } from '@/shared';
import { logger } from '@/shared/service/pino';

export function createEquipmentUseCase(repository: EquipmentRepository, documentsAcl: DocumentsAcl) {
  const onError = async (equipmentId: CUID) => {
    await repository.deleteEquipment(equipmentId);
    throw new ApiError(500, EQUIPMENT_ERRORS.CREATE_FAILED);
  };

  return async (categoryId: CUID, locationId: Nullable<CUID>, equipment: CreateEquipmentDto) => {
    const equipmentWithSameSignature = await repository.getEquipmentBySignature(equipment.signature);

    if (equipmentWithSameSignature) {
      throw new ApiError(409, EQUIPMENT_ERRORS.ALREADY_EXISTS_BY_SIGNATURE(equipment.signature));
    }

    if (equipment.serial) {
      const equipmentWithSameSerial = await repository.getEquipmentBySerial(equipment.serial);

      if (equipmentWithSameSerial) {
        throw new ApiError(409, EQUIPMENT_ERRORS.ALREADY_EXISTS_BY_SERIAL(equipment.serial));
      }
    }

    const { documents, avatar, ...restEquipment } = equipment;

    let equipmentId: string | null = null;

    try {
      equipmentId = await repository.createEquipment(categoryId, locationId, restEquipment);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, EQUIPMENT_ERRORS.CREATE_FAILED);
    }

    if (!equipmentId) {
      throw new ApiError(500, EQUIPMENT_ERRORS.CREATE_FAILED);
    }

    if (documents?.length) {
      const documentIds = await Promise.all(
        documents.map((document) => documentsAcl.uploadEquipmentDocument(equipmentId, document)),
      );

      if (documentIds.some(Boolean)) {
        throw onError(equipmentId);
      }

      try {
        await Promise.all(
          documentIds
            .filter(Boolean)
            .map((documentId) => repository.addEquipmentDocument(equipmentId, documentId!)),
        );
      } catch (err) {
        logger.info(err);
        throw onError(equipmentId);
      }
    }

    if (avatar && avatar instanceof File) {
      const avatarId = await documentsAcl.uploadEquipmentPhoto(equipmentId, avatar);
      if (!avatarId) {
        throw onError(equipmentId);
      }

      try {
        await repository.setEquipmentAvatar(equipmentId, avatarId);
        await repository.updateEquipmentPhotos(equipmentId, avatarId);
      } catch (err) {
        logger.info(err);
        throw new ApiError(400, API_ERROR_MESSAGES.EQUIPMENT.UPDATE_FAILED);
      }
    }

    return equipmentId;
  };
}
