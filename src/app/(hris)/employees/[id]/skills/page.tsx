import { Suspense } from 'react';
import { type CUID } from '@/shared';
import { EmployeeCard } from '@/app/(hris)/employees/[id]/_components/employee-card';
import EmployeeSkillsContent from '@/app/(hris)/employees/[id]/skills/content';
import { EmployeeLoadingSkeleton } from '@/app/(hris)/employees/[id]/_components/employee-loading-skeleton';

type Props = {
  params: Promise<{
    id: CUID;
  }>;
  searchParams: Promise<{
    search: string;
  }>;
};
export default async function EmployeeSkillsPage(props: Props) {
  const [{ id }, { search }] = await Promise.all([props.params, props.searchParams]);
  return (
    <EmployeeCard employeeId={id} query={search}>
      <Suspense
        fallback={
          <EmployeeLoadingSkeleton
            sections={['basicInfo', 'projects', 'employmentHistory', 'education', 'courses']}
          />
        }
      >
        <EmployeeSkillsContent id={id} />
      </Suspense>
    </EmployeeCard>
  );
}
