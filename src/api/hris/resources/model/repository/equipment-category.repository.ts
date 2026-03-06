import { type EquipmentCategoryDto } from '@/api/hris/resources/model/dtos';
import { type Nullable, type CUID } from '@/shared';

export type EquipmentCategoryRepository = {
  createCategory(name: string): Promise<CUID>;
  getCategoryByName(name: string): Promise<Nullable<EquipmentCategoryDto>>;
  getAllCategories(): Promise<EquipmentCategoryDto[]>;
  deleteCategory(id: CUID): Promise<void>;
};
