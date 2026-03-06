import { type Nullable, type CUID } from '@/shared';
import { type DocumentCategoryDto } from '../dtos';

export type DocumentsCategoryRepository = {
  createCategory: (name: string) => Promise<CUID>;
  getCategoryByName: (name: string) => Promise<Nullable<DocumentCategoryDto>>;
  getAllCategories: () => Promise<DocumentCategoryDto[]>;
  deleteCategories: (ids?: CUID[]) => Promise<void>;
};
