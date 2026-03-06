import {
  FeedbackTimeline,
  type MockedFeedback,
} from '@/app/(hris)/employees/[id]/feedback/_components/feedback-timeline';
import { type CUID } from '@/shared';
import { hrisApi } from '@/api/hris';
import { type FeedbackDto } from '@/api/hris/feedback/model/dtos';

type Props = {
  employeeId: CUID;
};

type FeedbackStatus = 'scheduled' | 'approaching' | 'overdue' | 'neutral' | null;

function calculateFeedbackStatus(feedback: FeedbackDto): FeedbackStatus {
  const now = new Date();
  const plannedDay = new Date(feedback.plannedDay);
  const daysUntil = Math.floor((plannedDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // If feedback is done
  if (feedback.isDone === true) {
    // If it has a neutral score, show as neutral
    if (feedback.feedbackScore === 'neutral') {
      return 'neutral';
    }
    // Otherwise, it's completed (no status badge)
    return null;
  }

  // If feedback is not done
  if (feedback.isDone === false || feedback.isDone === null) {
    // If planned day is in the past, it's overdue
    if (daysUntil < 0) {
      return 'overdue';
    }
    // If planned day is within 7 days, it's approaching
    if (daysUntil <= 7) {
      return 'approaching';
    }
    // Otherwise, it's scheduled
    return 'scheduled';
  }

  return null;
}

function mapFeedbackToMockedFeedback(
  feedback: FeedbackDto,
  hostName: string,
  participantNames: string[],
): MockedFeedback {
  return {
    id: feedback.id,
    date: new Date(feedback.plannedDay),
    status: calculateFeedbackStatus(feedback),
    type: feedback.type as 'buddy' | 'terminal' | 'other' | 'external',
    facilitators: [hostName],
    participants: participantNames,
    isDone: feedback.isDone,
    internalFeedback: feedback.internalFeedback,
    clientFeedback: feedback.clientFeedback,
    notes: feedback.notes,
    noteBefore: feedback.noteBefore,
    noteForPerson: feedback.noteForPerson,
    attachments: [], // Documents will be fetched separately if needed
  };
}

export async function EmployeeFeedbackContent({ employeeId }: Props) {
  const api = hrisApi;

  const [employee, me, feedbacksData] = await Promise.all([
    api.employees.getEmployeeById(employeeId),
    api.auth.getMe(),
    api.feedback.getFeedbacksByPersonId(employeeId),
  ]);

  // Get unique host IDs from feedbacks
  const hostIds = [...new Set(feedbacksData.map((feedback) => feedback.hostId))];

  // Fetch host employees
  const hostEmployees = hostIds.length > 0 ? await api.employees.getEmployeesById(hostIds) : [];

  // Create a map of hostId -> employee name
  const hostNameMap = new Map(
    hostEmployees.map((employee) => [employee.id, `${employee.firstName} ${employee.lastName}`]),
  );

  // Map feedbacks to MockedFeedback format
  // Participants will be fetched when opening the modal via server action
  const feedbacks: MockedFeedback[] = feedbacksData.map((feedback) => {
    const hostName = hostNameMap.get(feedback.hostId) || 'Unknown';
    return mapFeedbackToMockedFeedback(feedback, hostName, []);
  });

  return (
    <FeedbackTimeline
      dateFormat={me.dateFormat}
      employeeId={employeeId}
      feedbacks={feedbacks}
      isEditable={employee.status !== 'ARCHIVED' && true} // TODO: Use _access.edit when available
    />
  );
}
