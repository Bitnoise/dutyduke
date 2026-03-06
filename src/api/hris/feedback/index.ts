import { feedbackController, type FeedbackController } from '@/api/hris/feedback/infrastructure/controllers';
import { type OrganizationContext } from '@/api/hris';

export type FeedbackApiType = FeedbackController;

export function feedbackApi(organizationContext: OrganizationContext): FeedbackApiType {
  return feedbackController(organizationContext);
}
