import { Suspense } from 'react';
import { type OrderBy, type PageParams, type PaginationSearchParams, type SortSearchParams } from '@/shared';

import { EquipmentLoadingSkeleton } from '../../../_components';
import EquipmentDocumentsContent from './content';

type SearchParams = PaginationSearchParams &
  SortSearchParams<Extract<OrderBy, 'expDate-asc' | 'expDate-desc'>> & {
    documents: string;
  };

export default async function EquipmentDocumentsPage(
  props: PageParams<{ equipmentId: string }, SearchParams & { search: string }>,
) {
  const [params, searchParams] = await Promise.all([props.params, props.searchParams]);
  const page = searchParams?.page ? +searchParams.page : 1;
  const sort = searchParams?.sort ?? 'expDate-desc';
  const perPage = searchParams?.perPage ? +searchParams.perPage : undefined;

  return (
    <Suspense fallback={<EquipmentLoadingSkeleton sections={['documents']} />}>
      <EquipmentDocumentsContent id={params.equipmentId} page={page} perPage={perPage} sort={sort} />
    </Suspense>
  );
}
