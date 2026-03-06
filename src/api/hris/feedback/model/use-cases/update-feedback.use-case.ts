import { type UpdateFeedbackDto } from '@/api/hris/feedback/model/dtos';
import { type FeedbackRepository } from '@/api/hris/feedback/model/repositories';
import { FEEDBACK_ERROR_MESSAGES } from '@/api/hris/feedback/errors';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function updateFeedbackUseCase(repository: FeedbackRepository) {
  return async (feedbackId: CUID, feedback: UpdateFeedbackDto): Promise<void> => {
    try {
      // Business logic validation
      if (feedback.plannedDay && isNaN(new Date(feedback.plannedDay).getTime())) {
        throw new ApiError(400, FEEDBACK_ERROR_MESSAGES.INVALID_DATE);
      }

      // Type-specific validation
      if (feedback.type === 'other') {
        if (feedback.notes !== undefined && !feedback.notes) {
          throw new ApiError(400, FEEDBACK_ERROR_MESSAGES.NOTES_REQUIRED_FOR_OTHER);
        }
        if (feedback.feedbackScore === undefined || feedback.feedbackScore === null) {
          throw new ApiError(400, FEEDBACK_ERROR_MESSAGES.FEEDBACK_SCORE_REQUIRED_FOR_OTHER);
        }
      }

      return await repository.updateFeedback(feedbackId, feedback);
    } catch (err) {
      logger.info(err);
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(500, FEEDBACK_ERROR_MESSAGES.UPDATE_FAILED);
    }
  };
}
