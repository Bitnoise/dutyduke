import { type FeedbackRepository } from '@/api/hris/feedback/model/repositories';
import { FEEDBACK_ERROR_MESSAGES } from '@/api/hris/feedback/errors';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function deleteFeedbackUseCase(repository: FeedbackRepository) {
  return async (feedbackId: CUID): Promise<void> => {
    try {
      await repository.deleteFeedback(feedbackId);
    } catch (err) {
      logger.info(err);
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(500, FEEDBACK_ERROR_MESSAGES.DELETE_FAILED);
    }
  };
}
