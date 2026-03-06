import { EMPLOYEE_SKILLS_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { type ResourcesAcl } from '@/api/hris/employees/model/acl';

import { type UpdateEmployeeSkillsDto, type UpdateSkillDto } from '@/api/hris/employees/model/dtos';
import {
  type EmployeeRepository,
  type EmployeeSkillsRepository,
} from '@/api/hris/employees/model/repositories';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function updateEmployeeSkillsUseCase(
  employeeSkillsRepository: EmployeeSkillsRepository,
  employeeRepository: EmployeeRepository,
  resourcesAcl: ResourcesAcl,
) {
  const parseToUpdateDto = <T extends { id: CUID }>(records: T[], employeeId: CUID) =>
    records.map(({ id: _id, ...record }) => ({ ...record, employeeId }));

  const getUpdateSkillsDto = async (
    type: 'PRIMARY' | 'SECONDARY',
    employeeId: CUID,
    skills: string[],
  ): Promise<{ toUpdate: UpdateSkillDto[]; toRemove: CUID[] }> => {
    const skillsToCreate: { name: string }[] = [];
    const skillsToLink: UpdateSkillDto[] = [];
    const skillsToDelete: CUID[] = [];

    for (const skillName of skills) {
      const existingSkillId = await resourcesAcl.doesSkillExist(skillName);

      if (existingSkillId) {
        skillsToLink.push({
          type,
          skillId: existingSkillId,
          employeeId,
        });
      } else {
        skillsToCreate.push({ name: skillName });
      }
    }

    const createdSkillsIds = await Promise.all(
      skillsToCreate.map((skill) => resourcesAcl.createEmployeeSkill(skill.name)),
    );

    const createdSkillsToLink: UpdateSkillDto[] = createdSkillsIds.map((skillId) => {
      return {
        type,
        employeeId,
        skillId,
      };
    });

    const currentSkills = await employeeSkillsRepository.getSkillsByEmployeeId(employeeId, type);
    const currentSkillIds = currentSkills.map((skill) => skill.skillId);

    const currentSkillDetails = await resourcesAcl.getEmployeeSkills(type, employeeId, currentSkillIds);

    const skillsToRemove = currentSkillDetails
      .filter((skill) => !skills.includes(skill.name))
      .map((skill) => skill.id);

    skillsToDelete.push(...skillsToRemove);

    return { toUpdate: [...skillsToLink, ...createdSkillsToLink], toRemove: skillsToDelete };
  };

  return async (employeeId: CUID, skills: UpdateEmployeeSkillsDto) => {
    try {
      await employeeRepository.updateEmployee(employeeId, { description: skills.description });
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, EMPLOYEE_SKILLS_ERROR_MESSAGES.UPDATE_FAILED);
    }

    const [primarySkills, secondarySkills] = await Promise.all([
      getUpdateSkillsDto('PRIMARY', employeeId, skills.primarySkills),
      getUpdateSkillsDto('SECONDARY', employeeId, skills.secondarySkills),
    ]);

    try {
      await Promise.all([
        employeeSkillsRepository.updateSkills('PRIMARY', primarySkills.toUpdate),
        employeeSkillsRepository.updateSkills('SECONDARY', secondarySkills.toUpdate),
        employeeSkillsRepository.updateLanguages(employeeId, parseToUpdateDto(skills.languages, employeeId)),
      ]);

      await employeeSkillsRepository.removeSkillsFromEmployee(employeeId, [
        ...primarySkills.toRemove,
        ...secondarySkills.toRemove,
      ]);

      return;
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, EMPLOYEE_SKILLS_ERROR_MESSAGES.UPDATE_FAILED);
    }
  };
}
