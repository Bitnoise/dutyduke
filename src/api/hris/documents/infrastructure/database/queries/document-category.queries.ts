import { type OrganizationPrismaClient, type OrganizationPrisma } from '@/api/hris/prisma/client';
import { type Nullable, type CUID, ITEMS_PER_PAGE, getPaginatedData, type Paginated } from '@/shared';
import { type DocumentCategoryDto } from '../../../model/dtos';

export type DocumentsCategoryQueries = {
  getCategoryById: (id: CUID) => Promise<Nullable<DocumentCategoryDto>>;
  getAllCategories: (
    query?: string,
    page?: number,
    itemsPerPage?: number | 'all',
  ) => Promise<Paginated<DocumentCategoryDto>>;
};

export function documentsCategoryQueries(db: OrganizationPrismaClient): DocumentsCategoryQueries {
  const getCategoryById = (id: CUID): Promise<Nullable<DocumentCategoryDto>> =>
    db.equipmentCategory.findUnique({ where: { id } });

  const getAllCategories = async (
    query?: string,
    page = 1,
    itemsPerPage: number | 'all' = ITEMS_PER_PAGE,
  ): Promise<Paginated<DocumentCategoryDto>> => {
    const whereInput: OrganizationPrisma.DocumentCategoryWhereInput = {
      ...(query ? { name: { contains: query, mode: 'insensitive' } } : {}),
    };

    const [items, count] = await Promise.all([
      db.documentCategory.findMany({
        where: whereInput,
        take: itemsPerPage === 'all' ? undefined : itemsPerPage,
        skip: itemsPerPage === 'all' ? undefined : (page - 1) * itemsPerPage,
      }),
      db.documentCategory.count({ where: whereInput }),
    ]);

    return getPaginatedData(items, page, count);
  };

  return {
    getCategoryById,
    getAllCategories,
  };
}
