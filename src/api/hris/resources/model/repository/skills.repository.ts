import { type CreateSkillDto } from '@/api/hris/resources/model/dtos';
import { type CUID } from '@/shared';

export type SkillsRepository = {
  createSkill: (skill: CreateSkillDto) => Promise<CUID>;
  deleteSkill: (id: CUID) => Promise<void>;
};
