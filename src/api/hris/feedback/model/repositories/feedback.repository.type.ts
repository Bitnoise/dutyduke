import { type CreateFeedbackDto, type UpdateFeedbackDto } from '@/api/hris/feedback/model/dtos';
import { type CUID } from '@/shared';

export type FeedbackRepository = {
  createFeedback: (feedback: CreateFeedbackDto) => Promise<CUID>;
  updateFeedback: (feedbackId: CUID, feedback: UpdateFeedbackDto) => Promise<void>;
  deleteFeedback: (feedbackId: CUID) => Promise<void>;
};
