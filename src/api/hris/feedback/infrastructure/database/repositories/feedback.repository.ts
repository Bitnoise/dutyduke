import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { type CUID } from '@/shared';
import { type CreateFeedbackDto, type UpdateFeedbackDto } from '@/api/hris/feedback/model/dtos';
import { type FeedbackRepository } from '@/api/hris/feedback/model/repositories';

export function feedbackRepository(db: OrganizationPrismaClient): FeedbackRepository {
  const createFeedback = async (feedback: CreateFeedbackDto): Promise<CUID> => {
    const { participantIds, ...feedbackData } = feedback;

    const createdFeedback = await db.feedback.create({
      data: {
        ...feedbackData,
        plannedDay: new Date(feedbackData.plannedDay),
        participants: participantIds
          ? {
              create: participantIds.map((employeeId) => ({
                employeeId,
              })),
            }
          : undefined,
      },
    });

    return <CUID>createdFeedback.id;
  };

  const updateFeedback = async (feedbackId: CUID, feedback: UpdateFeedbackDto): Promise<void> => {
    const { participantIds, ...feedbackData } = feedback;

    await db.feedback.update({
      where: { id: feedbackId },
      data: {
        ...feedbackData,
        plannedDay: feedbackData.plannedDay ? new Date(feedbackData.plannedDay) : undefined,
        participants: participantIds
          ? {
              deleteMany: {},
              create: participantIds.map((employeeId) => ({
                employeeId,
              })),
            }
          : undefined,
      },
    });
  };

  const deleteFeedback = async (feedbackId: CUID): Promise<void> => {
    await db.feedback.delete({
      where: { id: feedbackId },
    });
  };

  return {
    createFeedback,
    updateFeedback,
    deleteFeedback,
  };
}
