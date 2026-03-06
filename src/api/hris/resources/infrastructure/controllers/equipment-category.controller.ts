import { type OrganizationContext } from '@/api/hris';
import { privateRoute, requirePermission, type PermissionChecker } from '@/api/hris/authorization';
import { ResourceType, PermissionAction } from '@/api/hris/authorization/permissions';
import { equipmentCategoryQueries } from '@/api/hris/resources/infrastructure/database/queries';
import { equipmentCategoryRepository } from '@/api/hris/resources/infrastructure/database/repositories';
import { type EquipmentCategoryDto, type EquipmentCategoryListDto } from '@/api/hris/resources/model/dtos';
import { createEquipmentCategoryUseCase } from '@/api/hris/resources/model/use-cases';
import { type Nullable, type CUID } from '@/shared';
import { deleteEquipmentCategoryUseCase } from '../../model/use-cases/delete-equipment-category.use-case';

export type EquipmentCategoryController = {
  createCategory(name: string): Promise<CUID>;
  deleteCategory(id: CUID): Promise<void>;
  getAllCategories(): Promise<EquipmentCategoryDto[]>;
  getCategoryByName(name: string): Promise<Nullable<EquipmentCategoryDto>>;
  getAllCategoriesList(page: number, perPage: number, search?: string): Promise<EquipmentCategoryListDto>;
};

export function equipmentCategoryController(
  organizationContext: OrganizationContext,
): EquipmentCategoryController {
  const equipmentCategoryQueriesImpl = equipmentCategoryQueries(organizationContext.db);
  const equipmentCategoryRepositoryImpl = equipmentCategoryRepository(organizationContext.db);

  const createCategory = async (checker: PermissionChecker, name: string) =>
    createEquipmentCategoryUseCase(equipmentCategoryRepositoryImpl)(name);

  const deleteCategory = async (checker: PermissionChecker, id: CUID) =>
    deleteEquipmentCategoryUseCase(equipmentCategoryRepositoryImpl)(id);

  const getAllCategories = async (_checker: PermissionChecker) =>
    equipmentCategoryQueriesImpl.getAllCategories();

  const getAllCategoriesList = async (
    checker: PermissionChecker,
    page: number = 1,
    perPage: number,
    search?: string,
  ): Promise<EquipmentCategoryListDto> => {
    const data = await equipmentCategoryQueriesImpl.getCategoryList(page, perPage, search);

    return {
      ...data,
    };
  };

  return {
    createCategory: requirePermission(ResourceType.COMPANY_EQUIPMENT, PermissionAction.EDIT, createCategory),
    deleteCategory: requirePermission(ResourceType.COMPANY_EQUIPMENT, PermissionAction.EDIT, deleteCategory),
    getAllCategories: privateRoute(getAllCategories),
    getAllCategoriesList: privateRoute(getAllCategoriesList),
    getCategoryByName: privateRoute(async (checker: PermissionChecker, name: string) => {
      return equipmentCategoryRepositoryImpl.getCategoryByName(name);
    }),
  };
}
