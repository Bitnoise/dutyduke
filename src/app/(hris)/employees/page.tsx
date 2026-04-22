import { getLocale, getTranslations } from 'next-intl/server';
import { type Metadata } from 'next';
import { unstable_noStore } from 'next/cache';
import { redirect } from 'next/navigation';
import { hrisApi } from '@/api/hris';
import {
  HRIS_ROUTES,
  type EmployeeListOrderBy,
  type PageParams,
  type PaginationSearchParams,
} from '@/shared';
import { Card, SearchInput } from '@/lib/ui';
import { EmployeesGridList } from '@/app/(hris)/employees/[id]/_components/employees-grid-list';
import { type EmployeeStatusDto } from '@/api/hris/employees/model/dtos';
import { FilterTag } from '@/lib/ui/components/filter-tag';
import { getEmployeeViewAccess, getPermissionChecker } from '@/api/hris/authorization';
import { Pagination } from '@/lib/ui/components/pagination';
import { Stack } from '@/lib/ui/components/stack';
import { EmployeesTable } from './_tables';
import { EmployeeBulkActions } from './_bulk-actions';
import { EmployeesOptions } from './_components/employees-options';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'employees.seo' });

  return {
    title: t('title'),
  };
}

type SearchParams = PaginationSearchParams & {
  sort: EmployeeListOrderBy;
  filter: string;
  search: string;
  perPage?: string;
};

export default async function EmployeeListView(props: PageParams<undefined, SearchParams>) {
  unstable_noStore();
  const searchParams = await props.searchParams;
  const t = await getTranslations();
  const api = hrisApi;
  const page = searchParams?.page ? +searchParams.page : 1;
  const sort = searchParams?.sort ?? 'lastName-asc';
  const search = searchParams?.search ?? '';
  const parsedFilter = (searchParams?.filter ?? '').split(',').filter(Boolean) as EmployeeStatusDto[];
  // Default to ACTIVE if filter is empty to prevent Prisma's `in: []` from returning no results
  const filter = parsedFilter.length > 0 ? parsedFilter : (['ACTIVE'] as EmployeeStatusDto[]);
  const perPage = searchParams?.perPage ? +searchParams.perPage : undefined;

  const [me, permissionChecker] = await Promise.all([api.auth.getMe(), getPermissionChecker()]);

  const isOwner = me.roles.includes('OWNER');

  // Users without company-wide access to the employees list shouldn't load it —
  // send them to their own profile (if they can view one) so they don't hit a 403.
  const { canView, hasCompanyWideAccess } = getEmployeeViewAccess(permissionChecker);
  if (!hasCompanyWideAccess) {
    return redirect(canView ? HRIS_ROUTES.employees.general.base(me.id) : HRIS_ROUTES.dashboard);
  }

  const data = await api.employees.getAllEmployeesList(page, search, sort, perPage, filter);

  return (
    <div className="flex min-h-full gap-x-1">
      <Card>
        <EmployeesOptions />
        <Stack className="pb-4" direction="column">
          <Stack>
            <SearchInput
              aria-label={t('forms.search')}
              className="basis-full xl:basis-2/5"
              placeholder={t('ctaLabels.search')}
            />
            <EmployeeBulkActions actions={data._access.actions} className="hidden xl:flex" />
          </Stack>
          <Stack className="hidden py-1.5 xl:flex">
            {data._access.actions.includes('filter') && (
              <>
                <p className="text-sm font-semibold">{t('filters.filters')}:</p>
                <FilterTag searchParamKey="FILTER" value="ACTIVE" variant="green">
                  {t('filters.active')}
                </FilterTag>
                <FilterTag searchParamKey="FILTER" value="ARCHIVED" variant="gray">
                  {t('filters.archived')}
                </FilterTag>
              </>
            )}
          </Stack>
        </Stack>
        <EmployeesGridList
          key={`grid-${page}-${search}-${sort}-${filter.join(',')}`}
          isNavigationEnabled
          className="xl:hidden"
          data={data}
          selectionMode={isOwner ? 'multiple' : undefined}
        />
        <EmployeesTable
          key={`table-${page}-${search}-${sort}-${filter.join(',')}`}
          isNavigationEnabled
          aria-label={t('employees.table')}
          className="hidden xl:table"
          data={data}
          selectionMode={isOwner ? 'multiple' : undefined}
        />
        <Pagination nextPage={data.nextPage} prevPage={data.prevPage} totalPages={data.totalPages} />
      </Card>
    </div>
  );
}
