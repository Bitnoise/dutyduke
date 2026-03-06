import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { type CUID, type Nullable } from '@/shared';
import { type FeedbackDto } from '@/api/hris/feedback/model/dtos';

export type FeedbackQueries = {
  getFeedbackById: (id: CUID) => Promise<Nullable<FeedbackDto>>;
  getFeedbacksByPersonId: (personId: CUID) => Promise<FeedbackDto[]>;
  getFeedbacksByHostId: (hostId: CUID) => Promise<FeedbackDto[]>;
};

export function feedbackQueries(db: OrganizationPrismaClient): FeedbackQueries {
  const getFeedbackById = async (id: CUID): Promise<Nullable<FeedbackDto>> => {
    const feedback = await db.feedback.findUnique({
      where: { id },
      include: {
        person: true,
        host: true,
        participants: {
          include: {
            employee: true,
          },
        },
      },
    });

    if (!feedback) {
      return null;
    }

    return {
      id: feedback.id,
      personId: feedback.personId,
      hostId: feedback.hostId,
      plannedDay: feedback.plannedDay,
      type: feedback.type,
      noteBefore: feedback.noteBefore,
      noteForPerson: feedback.noteForPerson,
      notes: feedback.notes,
      feedbackScore: feedback.feedbackScore,
      clientFeedback: feedback.clientFeedback,
      internalFeedback: feedback.internalFeedback,
      isDone: feedback.isDone,
      participantIds: feedback.participants.map((p) => p.employeeId as CUID),
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    };
  };

  const getFeedbacksByPersonId = async (personId: CUID): Promise<FeedbackDto[]> => {
    const feedbacks = await db.feedback.findMany({
      where: { personId },
      include: {
        person: true,
        host: true,
        participants: {
          include: {
            employee: true,
          },
        },
      },
      orderBy: { plannedDay: 'desc' },
    });

    return feedbacks.map((feedback) => ({
      id: feedback.id,
      personId: feedback.personId,
      hostId: feedback.hostId,
      plannedDay: feedback.plannedDay,
      type: feedback.type,
      noteBefore: feedback.noteBefore,
      noteForPerson: feedback.noteForPerson,
      notes: feedback.notes,
      feedbackScore: feedback.feedbackScore,
      clientFeedback: feedback.clientFeedback,
      internalFeedback: feedback.internalFeedback,
      isDone: feedback.isDone,
      participantIds: feedback.participants.map((p) => p.employeeId as CUID),
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    }));
  };

  const getFeedbacksByHostId = async (hostId: CUID): Promise<FeedbackDto[]> => {
    const feedbacks = await db.feedback.findMany({
      where: { hostId },
      include: {
        person: true,
        host: true,
        participants: {
          include: {
            employee: true,
          },
        },
      },
      orderBy: { plannedDay: 'desc' },
    });

    return feedbacks.map((feedback) => ({
      id: feedback.id,
      personId: feedback.personId,
      hostId: feedback.hostId,
      plannedDay: feedback.plannedDay,
      type: feedback.type,
      noteBefore: feedback.noteBefore,
      noteForPerson: feedback.noteForPerson,
      notes: feedback.notes,
      feedbackScore: feedback.feedbackScore,
      clientFeedback: feedback.clientFeedback,
      internalFeedback: feedback.internalFeedback,
      isDone: feedback.isDone,
      participantIds: feedback.participants.map((p) => p.employeeId as CUID),
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    }));
  };

  return {
    getFeedbackById,
    getFeedbacksByPersonId,
    getFeedbacksByHostId,
  };
}
