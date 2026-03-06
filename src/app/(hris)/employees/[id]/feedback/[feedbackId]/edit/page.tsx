import { getLocale, getTranslations } from 'next-intl/server';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BasicHeader } from '@/lib/ui/components/basic-header';
import { hrisApi } from '@/api/hris';
import { type CUID, parseDate } from '@/shared';
import { type Item } from '@/lib/ui/components/combo-box/types';
import { Avatar, Card } from '@/lib/ui';
import { EditFeedbackForm } from './_forms/edit-feedback-form';
import { type EditFeedbackForm as EditFeedbackFormType } from './_schemas/edit-feedback.schema';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'employees.feedback.schedule' });

  return {
    title: t('editTitle'),
  };
}

type Props = {
  params: Promise<{
    id: CUID;
    feedbackId: CUID;
  }>;
};

export default async function EditFeedbackPage({ params }: Props) {
  const { id, feedbackId } = await params;
  const t = await getTranslations('employees.feedback.schedule');
  const api = hrisApi;

  const [employees, me, feedback] = await Promise.all([
    api.employees.getAllEmployees(),
    api.auth.getMe(),
    api.feedback.getFeedbackById(feedbackId).catch(() => null),
  ]);

  if (!feedback) {
    notFound();
  }

  // Format facilitators string (hostId,participantId1,participantId2)
  const allParticipantIds = [feedback.hostId, ...feedback.participantIds];
  const facilitators = allParticipantIds.join(',');

  // Format date in ISO format for DateField parsing
  const formattedDate = parseDate(feedback.plannedDay, 'YYYY-MM-DD');

  const employeeList: Item[] = employees.map((employee) => ({
    key: employee.id,
    textValue: `${employee.firstName} ${employee.lastName}`,
    label: (
      <div className="flex items-center gap-x-2">
        <Avatar avatarId={employee.avatarId} size="xs" />
        <div>
          {employee.firstName} {employee.lastName}
        </div>
      </div>
    ),
  }));

  const formData: EditFeedbackFormType = {
    type: feedback.type,
    date: formattedDate,
    facilitators,
    noteBefore: feedback.noteBefore || '',
    noteForPerson: feedback.noteForPerson || '',
    notes: feedback.notes || '',
    feedbackScore: feedback.feedbackScore || undefined,
    clientFeedback: feedback.clientFeedback || '',
    internalFeedback: feedback.internalFeedback || '',
    isDone: feedback.isDone ?? false,
  };

  return (
    <div className="flex min-h-full gap-x-1">
      <Card>
        <BasicHeader>{t('editTitle')}</BasicHeader>
        <EditFeedbackForm
          dateFormat={me.dateFormat}
          employeeId={id}
          employees={employeeList}
          feedbackId={feedbackId}
          form={formData}
        />
      </Card>
    </div>
  );
}
