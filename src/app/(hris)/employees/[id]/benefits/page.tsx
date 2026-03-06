import { getTranslations as getNextTranslations } from 'next-intl/server';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { hrisApi } from '@/api/hris';
import { getUserRoles } from '@/api/hris/authorization';
import { EmployeeCard } from '@/app/(hris)/employees/[id]/_components/employee-card';
import { SearchInput, Section } from '@/lib/ui';
import { Pagination } from '@/lib/ui/components/pagination';
import { type CUID } from '@/shared';
import { Stack } from '@/lib/ui/components/stack';
import { type EmployeeBenefitOrderBy } from '@/api/hris/benefits/infrastructure/database/queries/benefit.queries';
import { EmployeeBenefitsTable } from '../_components/employee-benefits-table';
import { EmployeeBenefitsBulkActions } from '../_components/employee-benefits-bulk-actions';
import { EmployeeBenefitsGridList } from '../_components/employee-benefits-grid-list';

type Props = {
  params: Promise<{
    id: CUID;
  }>;
  searchParams: Promise<{
    page?: string;
    sort?: EmployeeBenefitOrderBy;
    search?: string;
    perPage?: string;
  }>;
};

export default async function EmployeeBenefitsPage(props: Props) {
  const [{ id }, { page, sort, search: _search, perPage }] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  const userRoles = await getUserRoles();
  const isOwner = userRoles.some((role) => role.key === 'OWNER');

  const t = await getTranslations('employees.benefits');
  const tNext = await getNextTranslations('employees.benefits');
  const api = hrisApi;

  const parsedPage = page ? +page : 1;
  const parsedPerPage = perPage ? +perPage : undefined;

  const [benefits, me] = await Promise.all([
    api.benefits.getEmployeeBenefitList(id, parsedPage, sort, parsedPerPage),
    api.auth.getMe(),
  ]);

  return (
    <EmployeeCard employeeId={id}>
      <Section heading={t('title')}>
        <Stack className="pb-4" direction="column">
          <Stack>
            <SearchInput
              aria-label={tNext('searchBenefits')}
              className="basis-full xl:basis-2/5"
              inputProps={{ placeholder: tNext('search') }}
            />
            <EmployeeBenefitsBulkActions actions={benefits._access.actions} employeeId={id} />
          </Stack>
        </Stack>
        <EmployeeBenefitsTable
          benefits={benefits}
          className="hidden xl:table"
          dateFormat={me.dateFormat}
          employeeId={id}
          navigationEnabled={isOwner}
        />
        <EmployeeBenefitsGridList
          benefits={benefits}
          className="xl:hidden"
          dateFormat={me.dateFormat}
          employeeId={id}
          navigationEnabled={isOwner}
        />
        <Pagination
          nextPage={benefits.nextPage}
          prevPage={benefits.prevPage}
          totalPages={benefits.totalPages}
        />
      </Section>
    </EmployeeCard>
  );
}
