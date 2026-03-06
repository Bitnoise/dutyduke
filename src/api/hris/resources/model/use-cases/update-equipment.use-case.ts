import { EQUIPMENT_ERRORS } from '@/api/hris/resources/errors';
import { type DocumentsAcl } from '@/api/hris/resources/model/acl';
import { type EquipmentDto, type UpdateEquipmentDto } from '@/api/hris/resources/model/dtos';
import { type EquipmentRepository } from '@/api/hris/resources/model/repository';
import { ApiError, type Nullable, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function updateEquipmentUseCase(repository: EquipmentRepository, documentsAcl: DocumentsAcl) {
  return async (
    equipmentId: CUID,
    equipment: UpdateEquipmentDto,
    currentAvatarId: Nullable<CUID>,
    categoryId?: CUID,
    locationId?: Nullable<CUID>,
  ): Promise<EquipmentDto> => {
    // validate equipment
    if (equipment.signature) {
      const equipmentWithSameSignature = await repository.getEquipmentBySignature(equipment.signature);

      if (equipmentWithSameSignature && equipmentWithSameSignature.id !== equipmentId) {
        throw new ApiError(409, EQUIPMENT_ERRORS.ALREADY_EXISTS_BY_SIGNATURE(equipment.signature));
      }
    }

    if (equipment.serial) {
      const equipmentWithSameSerial = await repository.getEquipmentBySerial(equipment.serial);

      if (equipmentWithSameSerial && equipmentWithSameSerial.id !== equipmentId) {
        throw new ApiError(409, EQUIPMENT_ERRORS.ALREADY_EXISTS_BY_SERIAL(equipment.serial));
      }
    }

    const { avatar, ...restEquipment } = equipment;
    let newAvatarId: Nullable<string> = null;

    /*
     when avatar is undefined it means that it was not provided and we should not take any action
     when avatar is null it means that avatar was removed
    */
    const currentAvatar = currentAvatarId ? await documentsAcl.getDocumentById(currentAvatarId) : null;

    if (avatar === null) {
      try {
        await repository.unsetEquipmentAvatar(equipmentId);
        await repository.setEquipmentPhotoIds(equipmentId, []);
      } catch (err) {
        logger.info(err);
        throw new ApiError(500, EQUIPMENT_ERRORS.UPDATE_FAILED);
      }
      if (currentAvatar) {
        try {
          await documentsAcl.deleteEquipmentFileById(currentAvatar.id);
        } catch (err) {
          logger.info(err);
          // revert current photo
          await repository.setEquipmentAvatar(equipmentId, currentAvatar.id);
          throw new ApiError(500, EQUIPMENT_ERRORS.UPDATE_FAILED);
        }
      }
    } else if (avatar instanceof File) {
      // new photo was uploaded

      try {
        // upload the photo
        const uploadedFileId = await documentsAcl.uploadEquipmentPhoto(equipmentId, avatar);
        newAvatarId = uploadedFileId;
      } catch (err) {
        logger.info(err);
        throw new ApiError(500, EQUIPMENT_ERRORS.UPDATE_FAILED);
      }

      if (!newAvatarId) {
        throw new ApiError(500, EQUIPMENT_ERRORS.UPDATE_FAILED);
      }

      try {
        await repository.setEquipmentAvatar(equipmentId, newAvatarId);
        await repository.updateEquipmentPhotos(equipmentId, newAvatarId);
        await repository.setEquipmentPhotoIds(equipmentId, [newAvatarId]);
      } catch (err) {
        logger.info(err);
        // remove uploaded photo
        await repository.unsetEquipmentAvatar(equipmentId);
        await repository.setEquipmentPhotoIds(equipmentId, []);
        await documentsAcl.deleteEquipmentFileById(newAvatarId);

        throw new ApiError(500, EQUIPMENT_ERRORS.UPDATE_FAILED);
      }

      if (currentAvatar) {
        try {
          await repository.setEquipmentPhotoIds(equipmentId, [newAvatarId]);
          await documentsAcl.deleteEquipmentFileById(currentAvatar.id);
        } catch (err) {
          // revert old equipment photo
          if (newAvatarId) {
            await documentsAcl.deleteEquipmentFileById(newAvatarId);
          }
          await repository.setEquipmentAvatar(equipmentId, currentAvatar.id);
          await repository.updateEquipmentPhotos(equipmentId, currentAvatar.id);
          logger.info(err);
          throw new ApiError(500, EQUIPMENT_ERRORS.UPDATE_FAILED);
        }
      }
    }

    try {
      if (categoryId) {
        await repository.updateEquipmentCategory(equipmentId, categoryId);
      }

      if (locationId !== undefined) {
        await repository.updateEquipmentLocation(equipmentId, locationId);
      }

      if (typeof avatar === 'string') {
        newAvatarId = avatar;
      }

      const updatedEquipment = await repository.updateEquipment(equipmentId, {
        ...restEquipment,
        avatarId: newAvatarId,
      });

      return updatedEquipment;
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, EQUIPMENT_ERRORS.UPDATE_FAILED);
    }
  };
}
