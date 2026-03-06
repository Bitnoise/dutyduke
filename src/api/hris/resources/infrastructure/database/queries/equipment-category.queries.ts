import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { type EquipmentCategoryDto, type EquipmentCategoryListDto } from '@/api/hris/resources/model/dtos';
import { type Nullable, type CUID, getPaginatedData } from '@/shared';

export type EquipmentCategoryQueries = {
  getCategoryById: (id: CUID) => Promise<Nullable<EquipmentCategoryDto>>;
  getAllCategories: () => Promise<EquipmentCategoryDto[]>;
  getCategoryList: (page: number, perPage: number, query?: string) => Promise<EquipmentCategoryListDto>;
};

export function equipmentCategoryQueries(db: OrganizationPrismaClient): EquipmentCategoryQueries {
  const getCategoryById = (id: CUID): Promise<Nullable<EquipmentCategoryDto>> =>
    db.equipmentCategory.findUnique({ where: { id } });

  const getAllCategories = (): Promise<EquipmentCategoryDto[]> => db.equipmentCategory.findMany();

  const getCategoryList = async (page: number, perPage: number, query?: string) => {
    const [data, totalItems] = await db.$transaction([
      db.equipmentCategory.findMany({
        where: {
          name: {
            contains: query,
          },
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      db.equipmentCategory.count({ where: { name: { contains: query } } }),
    ]);

    return getPaginatedData(data, page, totalItems, perPage);
  };
  return {
    getCategoryById,
    getAllCategories,
    getCategoryList,
  };
}
