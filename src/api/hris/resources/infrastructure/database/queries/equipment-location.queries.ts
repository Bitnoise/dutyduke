import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { getPaginatedData } from '@/shared';

export function equipmentLocationQueries(db: OrganizationPrismaClient) {
  const getAllEquipmentLocations = async () => {
    return db.equipmentLocalization.findMany();
  };

  const getAllLocationsList = async (page: number, perPage: number, query?: string) => {
    const [data, totalItems] = await db.$transaction([
      db.equipmentLocalization.findMany({
        where: {
          name: {
            contains: query,
          },
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      db.equipmentLocalization.count({ where: { name: { contains: query } } }),
    ]);

    return getPaginatedData(data, page, totalItems, perPage);
  };

  return {
    getAllEquipmentLocations,
    getAllLocationsList,
  };
}
