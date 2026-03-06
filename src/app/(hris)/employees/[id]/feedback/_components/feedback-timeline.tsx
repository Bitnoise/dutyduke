'use client';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { NoResults, Section } from '@/lib/ui';
import { type CUID, HRIS_ROUTES } from '@/shared';
import { FeedbackTimelineItem } from './feedback-timeline-item';

type FeedbackStatus = 'scheduled' | 'approaching' | 'overdue' | 'neutral' | null;
type FeedbackType = 'buddy' | 'terminal' | 'other' | 'external';

export type MockedFeedback = {
  id: string;
  date: Date;
  status: FeedbackStatus;
  type: FeedbackType;
  facilitators: string[];
  participants?: string[];
  isDone?: boolean | null;
  internalFeedback?: string | null;
  clientFeedback?: string | null;
  notes?: string | null;
  noteBefore?: string | null;
  noteForPerson?: string | null;
  attachments?: Array<{ id: string; uri: string; name: string }>;
};

type Props = {
  employeeId: CUID;
  feedbacks: MockedFeedback[];
  isEditable: boolean;
  dateFormat: string;
};

export function FeedbackTimeline({ isEditable, employeeId, feedbacks, dateFormat }: Props) {
  const t = useTranslations();
  const router = useRouter();

  return (
    <Section
      className="flex flex-col gap-1 pb-16"
      editLabel={t('employees.feedback.scheduleFeedback')}
      heading={t('employees.feedback.title')}
      icon="calendar"
      isEdit={isEditable}
      onEdit={() => router.push(HRIS_ROUTES.employees.feedback.schedule(employeeId))}
    >
      {feedbacks.length ? (
        feedbacks.map((feedback, index) => (
          <FeedbackTimelineItem
            key={feedback.id}
            data={feedback}
            dateFormat={dateFormat}
            employeeId={employeeId}
            first={index === 0}
            index={index}
            isEditable={isEditable}
            last={feedbacks.length - 1 === index}
          />
        ))
      ) : (
        <NoResults />
      )}
    </Section>
  );
}
