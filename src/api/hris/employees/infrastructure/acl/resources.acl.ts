import { instantiateHrisApi, type OrganizationContext } from '@/api/hris';
import { type ResourcesAcl } from '@/api/hris/employees/model/acl';
import { type EmployeeSkillDto } from '@/api/hris/employees/model/dtos';
import { type SkillType } from '@/api/hris/prisma/client';
import { type CUID } from '@/shared';

export function resourcesAcl(organizationContext: OrganizationContext): ResourcesAcl {
  const getEmployeeSkills = async (
    type: SkillType,
    employeeId: CUID,
    skillIds: CUID[],
  ): Promise<EmployeeSkillDto[]> => {
    const hrisApi = instantiateHrisApi(organizationContext);

    const skills = await Promise.all(skillIds.map((skillId) => hrisApi.resources.getSkillById(skillId)));

    return skills.filter(Boolean).map((skill) => ({
      id: skill!.id,
      type,
      employeeId,
      skillId: skill!.id,
      name: skill!.name,
    }));
  };

  const doesSkillExist = async (name: string) => {
    const hrisApi = instantiateHrisApi(organizationContext);

    const skill = await hrisApi.resources.getSkillByName(name);

    return skill?.id ?? null;
  };

  const createEmployeeSkill = async (name: string) => {
    const hrisApi = instantiateHrisApi(organizationContext);

    const skillId = await hrisApi.resources.createSkill({ name });

    return skillId;
  };

  const assignEquipment = async (equipmentId: CUID, employeeId: CUID) => {
    const hrisApi = instantiateHrisApi(organizationContext);

    await hrisApi.resources.assignEquipment(equipmentId, employeeId);
  };

  const unassignEquipment = async (equipmentId: CUID) => {
    const hrisApi = instantiateHrisApi(organizationContext);

    await hrisApi.resources.unassignEquipment(equipmentId);
  };

  return {
    getEmployeeSkills,
    doesSkillExist,
    createEmployeeSkill,
    assignEquipment,
    unassignEquipment,
  };
}
