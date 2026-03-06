import { getLocale, getTranslations } from 'next-intl/server';
import { type Metadata } from 'next';
import { BasicHeader } from '@/lib/ui/components/basic-header';
import { hrisApi } from '@/api/hris';
import { type CUID } from '@/shared';
import { type Item } from '@/lib/ui/components/combo-box/types';
import { Avatar, Card } from '@/lib/ui';
import { ScheduleFeedbackForm } from './_forms/schedule-feedback-form';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'employees.feedback.schedule' });

  return {
    title: t('title'),
  };
}

type Props = {
  params: Promise<{
    id: CUID;
  }>;
};

export default async function ScheduleFeedbackPage(props: Props) {
  const { id } = await props.params;
  const t = await getTranslations('employees.feedback.schedule');
  const api = hrisApi;

  const [employees, me] = await Promise.all([api.employees.getAllEmployees(), api.auth.getMe()]);

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

  return (
    <div className="flex min-h-full gap-x-1">
      <Card>
        <BasicHeader>{t('title')}</BasicHeader>
        <ScheduleFeedbackForm dateFormat={me.dateFormat} employeeId={id} employees={employeeList} />
      </Card>
    </div>
  );
}
