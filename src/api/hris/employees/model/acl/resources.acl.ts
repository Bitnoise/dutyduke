import { type EmployeeSkillDto } from '@/api/hris/employees/model/dtos';
import { type SkillType } from '@/api/hris/prisma/client';
import { type Nullable, type CUID } from '@/shared';

export type ResourcesAcl = {
  getEmployeeSkills: (type: SkillType, employeeId: CUID, skillIds: CUID[]) => Promise<EmployeeSkillDto[]>;
  doesSkillExist: (name: string) => Promise<Nullable<CUID>>;
  createEmployeeSkill: (name: string) => Promise<CUID>;
  assignEquipment: (equipmentId: CUID, employeeId: CUID) => Promise<void>;
  unassignEquipment: (equipmentId: CUID) => Promise<void>;
};
