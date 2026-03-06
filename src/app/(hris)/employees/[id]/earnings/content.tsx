import { hrisApi } from '@/api/hris';
import { EaringsTimeline } from '@/app/(hris)/employees/[id]/earnings/_components/earnings-timeline';
import { type CUID } from '@/shared';

type Props = {
  employeeId: CUID;
};

export async function EmployeeEarningsContent({ employeeId }: Props) {
  const api = hrisApi;

  const [earningsData, employee, me] = await Promise.all([
    api.employees.getEmployeeEarnings(employeeId),
    api.employees.getEmployeeById(employeeId),
    api.auth.getMe(),
  ]);

  const { earnings, _access } = earningsData;

  return (
    <EaringsTimeline
      dateFormat={me.dateFormat}
      earnings={earnings}
      employeeId={employeeId}
      isEditable={employee.status !== 'ARCHIVED' && _access.edit}
    />
  );
}
