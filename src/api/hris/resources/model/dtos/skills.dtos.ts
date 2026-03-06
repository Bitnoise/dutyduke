import { type CUID, type Paginated } from '@/shared';

export type CreateSkillDto = {
  name: string;
};

export type SkillDto = {
  id: CUID;
  name: string;
};

export type SkillListDto = Paginated<SkillDto>;
