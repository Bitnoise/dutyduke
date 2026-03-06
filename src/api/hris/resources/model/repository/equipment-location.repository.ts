import { type EquipmentLocationDto } from '@/api/hris/resources/model/dtos';
import { type Nullable, type CUID } from '@/shared';

export type EquipmentLocationRepository = {
  createEquipmentLocation(name: string): Promise<CUID>;
  getEquipmentLocationByName(name: string): Promise<Nullable<EquipmentLocationDto>>;
  deleteEquipmentLocation(id: CUID): Promise<void>;
};
