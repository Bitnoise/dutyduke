import { API_ERROR_MESSAGES, ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type SkillsRepository } from '../repository/skills.repository';

export function deleteSkillUseCase(repository: SkillsRepository) {
  return async (id: CUID) => {
    try {
      await repository.deleteSkill(id);
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, API_ERROR_MESSAGES.SKILL.DELETE_SKILL_FAILED(id));
    }
  };
}
