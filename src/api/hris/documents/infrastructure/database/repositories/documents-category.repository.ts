import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { type CUID } from '@/api/hris/types';
import { type DocumentsCategoryRepository } from '../../../model/repositories';

export function documentCategoryRepository(db: OrganizationPrismaClient): DocumentsCategoryRepository {
  const createCategory = async (name: string) => {
    const createdCategory = await db.documentCategory.upsert({
      where: {
        name,
      },
      update: {
        name,
      },
      create: {
        name,
      },
    });

    return createdCategory.id;
  };

  const getCategoryByName = async (name: string) =>
    db.documentCategory.findFirst({ where: { name: { equals: name, mode: 'insensitive' } } });

  const getAllCategories = async () => db.documentCategory.findMany();

  const deleteCategories = async (ids?: CUID[]) => {
    if (!ids) {
      await db.documentCategory.deleteMany();
    } else {
      await db.documentCategory.deleteMany({
        where: {
          id: { in: ids },
        },
      });
    }
  };

  return {
    createCategory,
    getCategoryByName,
    getAllCategories,
    deleteCategories,
  };
}
