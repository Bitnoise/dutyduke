import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { type SkillListDto, type SkillDto } from '@/api/hris/resources/model/dtos';
import { type CUID, getPaginatedData } from '@/shared';

type SkillsQueries = {
  getSkillById: (id: CUID) => Promise<SkillDto | null>;
  getAllSkills: () => Promise<SkillDto[]>;
  getSkillByName: (name: string) => Promise<SkillDto | null>;
  getAllSkillsList: (page: number, perPage: number, query?: string) => Promise<SkillListDto>;
};

export function skillsQueries(db: OrganizationPrismaClient): SkillsQueries {
  const getSkillById = async (id: CUID) => db.skill.findUnique({ where: { id } });

  const getAllSkills = async () => db.skill.findMany();

  const getSkillByName = async (name: string) =>
    db.skill.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

  const getAllSkillsList = async (page: number, perPage: number, query?: string) => {
    const [data, totalItems] = await db.$transaction([
      db.skill.findMany({
        where: {
          name: {
            contains: query,
          },
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      db.skill.count({ where: { name: { contains: query } } }),
    ]);

    return getPaginatedData(data, page, totalItems, perPage);
  };
  return {
    getSkillById,
    getAllSkills,
    getSkillByName,
    getAllSkillsList,
  };
}
