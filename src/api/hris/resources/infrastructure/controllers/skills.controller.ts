import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { type CreateSkillSchema } from '@/api/hris/resources/infrastructure/controllers/schemas';
import { skillsQueries } from '@/api/hris/resources/infrastructure/database/queries/skill.queries';
import { skillsRepository } from '@/api/hris/resources/infrastructure/database/repositories/skills.repository';
import { createSkillUseCase, deleteSkillUseCase } from '@/api/hris/resources/model/use-cases';
import { isOwnerRoute, privateRoute, type PermissionChecker } from '@/api/hris/authorization';
import { type CUID } from '@/shared';
import { type SkillListDto } from '../../model/dtos';

export function skillsController(db: OrganizationPrismaClient) {
  const skillsRepositoryImpl = skillsRepository(db);
  const skillsQueriesImpl = skillsQueries(db);

  const createSkill = async (checker: PermissionChecker, skill: CreateSkillSchema) =>
    createSkillUseCase(skillsRepositoryImpl)(skill);

  const deleteSkill = async (checker: PermissionChecker, id: CUID) =>
    deleteSkillUseCase(skillsRepositoryImpl)(id);

  const getAllSkillsList = async (
    checker: PermissionChecker,
    page: number = 1,
    perPage: number,
    search?: string,
  ): Promise<SkillListDto> => {
    const data = await skillsQueriesImpl.getAllSkillsList(page, perPage, search);

    return {
      ...data,
    };
  };

  return {
    createSkill: isOwnerRoute(createSkill),
    deleteSkill: isOwnerRoute(deleteSkill),
    getSkillById: skillsQueriesImpl.getSkillById,
    getSkillByName: skillsQueriesImpl.getSkillByName,
    getAllSkills: skillsQueriesImpl.getAllSkills,
    getAllSkillsList: privateRoute(getAllSkillsList),
  };
}
