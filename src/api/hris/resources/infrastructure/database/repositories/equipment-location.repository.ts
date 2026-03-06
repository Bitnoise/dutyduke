import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { type EquipmentLocationRepository } from '@/api/hris/resources/model/repository';
import { type CUID } from '@/shared';

export function equipmentLocationRepository(db: OrganizationPrismaClient): EquipmentLocationRepository {
  const createEquipmentLocation = async (name: string) => {
    const createdLocation = await db.equipmentLocalization.create({
      data: {
        name,
      },
    });

    return createdLocation.id;
  };

  const getEquipmentLocationByName = async (name: string) => {
    return db.equipmentLocalization.findFirst({ where: { name: { equals: name, mode: 'insensitive' } } });
  };

  const deleteEquipmentLocation = async (id: CUID) => {
    await db.equipmentLocalization.delete({ where: { id } });
  };

  return {
    createEquipmentLocation,
    getEquipmentLocationByName,
    deleteEquipmentLocation,
  };
}
