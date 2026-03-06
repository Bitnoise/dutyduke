import { type CreateSkillDto } from '@/api/hris/resources/model/dtos';
import { type SkillsRepository } from '@/api/hris/resources/model/repository';

export function createSkillUseCase(skillsRepository: SkillsRepository) {
  return async (skill: CreateSkillDto) => skillsRepository.createSkill(skill);
}
