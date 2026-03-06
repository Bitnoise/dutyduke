import { Suspense } from 'react';
import { type IdParams, type PageParams } from '@/shared';
import { EmployeeEarningsContent } from '@/app/(hris)/employees/[id]/earnings/content';
import { EmployeeCard } from '@/app/(hris)/employees/[id]/_components/employee-card';
import { EmployeeLoadingSkeleton } from '@/app/(hris)/employees/[id]/_components/employee-loading-skeleton';

export default async function EmployeeEarningsView(
  props: PageParams<IdParams, { search: string }>,
): Promise<JSX.Element> {
  const [params, searchParams] = await Promise.all([props.params, props.searchParams]);
  return (
    <EmployeeCard employeeId={params.id} query={searchParams?.search}>
      <Suspense fallback={<EmployeeLoadingSkeleton sections={['earnings']} />}>
        <EmployeeEarningsContent employeeId={params.id} />
      </Suspense>
    </EmployeeCard>
  );
}
