import { Suspense } from 'react';
import {
  type IdParams,
  type OrderBy,
  type PageParams,
  type PaginationSearchParams,
  type SortSearchParams,
} from '@/shared';

import { EmployeeCard } from '@/app/(hris)/employees/[id]/_components/employee-card';

import EmployeeDocumentsContent from '@/app/(hris)/employees/[id]/documents/content';
import { EmployeeLoadingSkeleton } from '@/app/(hris)/employees/[id]/_components/employee-loading-skeleton';

type SearchParams = PaginationSearchParams &
  SortSearchParams<Extract<OrderBy, 'createdAt-asc' | 'createdAt-desc' | 'expDate-asc' | 'expDate-desc'>> & {
    documents: string;
  };

export default async function EmployeeDocumentsPage(
  props: PageParams<IdParams, SearchParams & { search: string }>,
) {
  const [params, searchParams] = await Promise.all([props.params, props.searchParams]);
  const page = searchParams?.page ? +searchParams.page : 1;
  const sort = searchParams?.sort ?? 'expDate-desc';

  return (
    <EmployeeCard employeeId={params.id} query={searchParams?.search}>
      <Suspense fallback={<EmployeeLoadingSkeleton sections={['documents']} />}>
        <EmployeeDocumentsContent id={params.id} page={page} sort={sort} />
      </Suspense>
    </EmployeeCard>
  );
}
