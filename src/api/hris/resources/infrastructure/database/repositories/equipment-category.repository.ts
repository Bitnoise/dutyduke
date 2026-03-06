import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { type EquipmentCategoryRepository } from '@/api/hris/resources/model/repository';
import { type CUID } from '@/shared';

export function equipmentCategoryRepository(db: OrganizationPrismaClient): EquipmentCategoryRepository {
  const createCategory = async (name: string) => {
    const createdCategory = await db.equipmentCategory.create({
      data: {
        name,
      },
    });

    return createdCategory.id;
  };

  const getCategoryByName = async (name: string) =>
    db.equipmentCategory.findFirst({ where: { name: { equals: name, mode: 'insensitive' } } });

  const getAllCategories = async () => db.equipmentCategory.findMany();

  const deleteCategory = async (id: CUID) => {
    await db.equipmentCategory.delete({ where: { id } });
  };

  return {
    createCategory,
    getCategoryByName,
    getAllCategories,
    deleteCategory,
  };
}
