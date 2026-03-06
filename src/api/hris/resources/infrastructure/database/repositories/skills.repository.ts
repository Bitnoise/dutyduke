import { type SkillsRepository } from '@/api/hris/resources/model/repository';
import { type CreateSkillDto } from '@/api/hris/resources/model/dtos';
import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { type CUID } from '@/shared';

export function skillsRepository(db: OrganizationPrismaClient): SkillsRepository {
  const createSkill = async (skill: CreateSkillDto) => {
    const createdSkill = await db.skill.create({ data: skill });

    return createdSkill.id;
  };

  const deleteSkill = async (id: CUID) => {
    await db.skill.delete({ where: { id } });
  };

  return {
    createSkill,
    deleteSkill,
  };
}
