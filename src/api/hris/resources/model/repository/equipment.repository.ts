import {
  type EquipmentDto,
  type CreateEquipmentDto,
  type UpdateEquipmentDto,
  type EquipmentStatus,
} from '@/api/hris/resources/model/dtos';
import { type Nullable, type CUID } from '@/shared';

export type EquipmentRepository = {
  createEquipment: (
    categoryId: CUID,
    locationId: Nullable<CUID>,
    equipment: Omit<CreateEquipmentDto, 'documents' | 'photo'>,
  ) => Promise<CUID>;
  deleteEquipment: (equipmentId: CUID) => Promise<void>;
  getEquipmentBySerial: (serial: string) => Promise<Nullable<EquipmentDto>>;
  getEquipmentBySignature: (signature: string) => Promise<Nullable<EquipmentDto>>;
  addEquipmentDocument: (equipmentId: CUID, documentId: CUID) => Promise<CUID>;
  updateEquipmentPhotos: (equipmentId: CUID, photoId: CUID) => Promise<void>;
  updateEquipment: (equipmentId: CUID, equipment: Omit<UpdateEquipmentDto, 'photo'>) => Promise<EquipmentDto>;
  assignEquipment: (equipmentId: CUID, assigneeId: CUID) => Promise<EquipmentDto>;
  unassignEquipment: (equipmentId: CUID) => Promise<EquipmentDto>;
  updateEquipmentCategory: (equipmentId: CUID, categoryId: CUID) => Promise<void>;
  updateEquipmentLocation: (equipmentId: CUID, locationId: Nullable<CUID>) => Promise<void>;
  setEquipmentAvatar: (equipmentId: CUID, avatarId: CUID) => Promise<void>;
  unsetEquipmentAvatar: (equipmentId: CUID) => Promise<void>;
  getEquipmentPhotos: (equipmentId: CUID) => Promise<CUID[]>;
  setEquipmentPhotoIds: (equipmentId: CUID, photoIds: CUID[]) => Promise<void>;
  getEquipmentById: (equipmentId: CUID) => Promise<Nullable<EquipmentDto>>;
  updateEquipmentStatus: (id: CUID, status: EquipmentStatus, description: string) => Promise<void>;
};
