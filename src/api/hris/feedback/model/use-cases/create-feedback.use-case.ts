import { type CreateFeedbackDto } from '@/api/hris/feedback/model/dtos';
import { type FeedbackRepository } from '@/api/hris/feedback/model/repositories';
import { FEEDBACK_ERROR_MESSAGES } from '@/api/hris/feedback/errors';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function createFeedbackUseCase(repository: FeedbackRepository) {
  return async (feedback: CreateFeedbackDto): Promise<CUID> => {
    try {
      // Business logic validation
      if (!feedback.hostId) {
        throw new ApiError(400, FEEDBACK_ERROR_MESSAGES.HOST_REQUIRED);
      }

      if (!feedback.personId) {
        throw new ApiError(400, FEEDBACK_ERROR_MESSAGES.PERSON_REQUIRED);
      }

      if (!feedback.plannedDay) {
        throw new ApiError(400, FEEDBACK_ERROR_MESSAGES.INVALID_DATE);
      }

      // Type-specific validation
      if (feedback.type === 'other') {
        if (!feedback.notes) {
          throw new ApiError(400, FEEDBACK_ERROR_MESSAGES.NOTES_REQUIRED_FOR_OTHER);
        }
        if (!feedback.feedbackScore) {
          throw new ApiError(400, FEEDBACK_ERROR_MESSAGES.FEEDBACK_SCORE_REQUIRED_FOR_OTHER);
        }
      }

      return await repository.createFeedback(feedback);
    } catch (err) {
      logger.info(err);
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(500, FEEDBACK_ERROR_MESSAGES.CREATE_FAILED);
    }
  };
}
