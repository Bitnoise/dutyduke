import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { type EquipmentChangelogRepository } from '@/api/hris/resources/model/repository';
import { type CUID } from '@/shared';

export function equipmentChangelogRepository(db: OrganizationPrismaClient): EquipmentChangelogRepository {
  const createLog = async (actorId: CUID, previousState: string, currentState: string) => {
    await db.equipmentChangelog.create({
      data: {
        previousState,
        currentState,
        actorId,
      },
    });
  };

  return {
    createLog,
  };
}
