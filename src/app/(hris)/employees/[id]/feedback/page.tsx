import { Suspense } from 'react';
import { type CUID } from '@/shared';
import { EmployeeCard } from '@/app/(hris)/employees/[id]/_components/employee-card';
import { EmployeeLoadingSkeleton } from '@/app/(hris)/employees/[id]/_components/employee-loading-skeleton';
import { EmployeeFeedbackContent } from '@/app/(hris)/employees/[id]/feedback/content';

interface Props {
  params: Promise<{
    id: CUID;
  }>;
  searchParams: Promise<{
    search: string;
  }>;
}

export default async function EmployeeFeedbackPage(props: Props) {
  const [{ id }, { search }] = await Promise.all([props.params, props.searchParams]);
  return (
    <EmployeeCard employeeId={id} query={search}>
      <Suspense fallback={<EmployeeLoadingSkeleton sections={[]} />}>
        <EmployeeFeedbackContent employeeId={id} />
      </Suspense>
    </EmployeeCard>
  );
}
