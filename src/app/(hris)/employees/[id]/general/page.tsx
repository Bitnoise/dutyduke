import { Suspense } from 'react';
import { type CUID } from '@/shared';
import { EmployeeCard } from '@/app/(hris)/employees/[id]/_components/employee-card';
import EmployeeGeneralContent from '@/app/(hris)/employees/[id]/general/content';
import { EmployeeLoadingSkeleton } from '@/app/(hris)/employees/[id]/_components/employee-loading-skeleton';

interface Props {
  params: Promise<{
    id: CUID;
  }>;
  searchParams: Promise<{
    search: string;
  }>;
}

export default async function EmployeeGeneralView(props: Props) {
  const [params, searchParams] = await Promise.all([props.params, props.searchParams]);
  return (
    <EmployeeCard employeeId={params.id} query={searchParams.search}>
      <Suspense
        fallback={<EmployeeLoadingSkeleton sections={['basicInfo', 'partnership', 'contact', 'other']} />}
      >
        <EmployeeGeneralContent id={params.id} />
      </Suspense>
    </EmployeeCard>
  );
}
