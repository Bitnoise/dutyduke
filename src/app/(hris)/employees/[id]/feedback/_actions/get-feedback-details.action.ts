'use server';

import { type CUID } from '@/shared';
import { prisma } from '@/api/hris/prisma/client';

type FeedbackDetailsResult = {
  id: string;
  date: Date;
  status: 'scheduled' | 'approaching' | 'overdue' | 'neutral' | null;
  type: 'buddy' | 'terminal' | 'other' | 'external';
  facilitators: string[];
  participants?: string[];
  isDone?: boolean;
  internalFeedback?: string;
  clientFeedback?: string;
  notes?: string;
  noteBefore?: string;
  noteForPerson?: string;
  attachments?: Array<{ id: string; uri: string; name: string }>;
};

export async function getFeedbackDetailsAction(feedbackId: CUID): Promise<FeedbackDetailsResult | null> {
  // Single organization - use singleton prisma client
  const db = prisma;

  const feedback = await db.feedback.findUnique({
    where: { id: feedbackId },
    include: {
      host: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      participants: {
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      feedbackDocuments: {
        select: {
          id: true,
          uri: true,
        },
      },
    },
  });

  if (!feedback) {
    return null;
  }

  const now = new Date();
  const plannedDay = new Date(feedback.plannedDay);
  const daysUntil = Math.floor((plannedDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  let status: 'scheduled' | 'approaching' | 'overdue' | 'neutral' | null = null;
  if (feedback.isDone === true) {
    if (feedback.feedbackScore === 'neutral') {
      status = 'neutral';
    }
  } else if (feedback.isDone === false || feedback.isDone === null) {
    if (daysUntil < 0) {
      status = 'overdue';
    } else if (daysUntil <= 7) {
      status = 'approaching';
    } else {
      status = 'scheduled';
    }
  }

  // Facilitators include both host and all participants
  const facilitators = [
    `${feedback.host.firstName} ${feedback.host.lastName}`,
    ...feedback.participants.map((p) => `${p.employee.firstName} ${p.employee.lastName}`),
  ];
  const participants = feedback.participants.map((p) => `${p.employee.firstName} ${p.employee.lastName}`);

  return {
    id: feedback.id,
    date: feedback.plannedDay,
    status,
    type: feedback.type as 'buddy' | 'terminal' | 'other' | 'external',
    facilitators,
    participants: participants.length > 0 ? participants : undefined,
    isDone: feedback.isDone ?? undefined,
    internalFeedback: feedback.internalFeedback ?? undefined,
    clientFeedback: feedback.clientFeedback ?? undefined,
    notes: feedback.notes ?? undefined,
    noteBefore: feedback.noteBefore ?? undefined,
    noteForPerson: feedback.noteForPerson ?? undefined,
    attachments:
      feedback.feedbackDocuments.length > 0
        ? feedback.feedbackDocuments.map((doc) => ({
            id: doc.id,
            uri: doc.uri,
            name: doc.uri.split('/').pop() || 'document',
          }))
        : undefined,
  };
}
