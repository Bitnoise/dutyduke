import { redirect } from 'next/navigation';
import { getTranslations as getNextTranslations } from 'next-intl/server';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { hrisApi } from '@/api/hris';
import { getPermissionChecker } from '@/api/hris/authorization';
import { PermissionAction, ResourceType } from '@/api/hris/authorization/permissions';
import { AssignEmployeeTable, AssignEmployeesGridList } from '@/app/(hris)/company/equipment/_components';
import { AssignEmployeesBottomButtons } from '@/app/(hris)/company/benefits/_components/assign-employees-bottom-buttons';
import { SearchInput } from '@/lib/ui';
import { BasicHeader } from '@/lib/ui/components/basic-header';
import { type EmployeeListOrderBy, HRIS_ROUTES } from '@/shared';
import { Pagination } from '@/lib/ui/components/pagination';
import { type EmployeeStatusDto } from '@/api/hris/employees/model/dtos';
import { FilterTag } from '@/lib/ui/components/filter-tag';
import { SEARCH_PARAM_KEYS } from '@/shared/constants/search-param-keys';

type Props = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: EmployeeListOrderBy;
    filter?: EmployeeStatusDto;
    [SEARCH_PARAM_KEYS.BENEFIT]?: string;
    perPage?: string;
  }>;
};

export default async function AssignBenefitsPage({ searchParams }: Props) {
  const { page, sort, search, filter, [SEARCH_PARAM_KEYS.BENEFIT]: benefit, perPage } = await searchParams;

  const permissionChecker = await getPermissionChecker();

  // Check if user has VIEW permission for COMPANY_BENEFITS
  const canViewBenefits = permissionChecker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.VIEW);

  if (!canViewBenefits) {
    return redirect(HRIS_ROUTES.benefits.base);
  }

  const parsedBenefitIds = benefit ? benefit.split(',') : [];

  if (parsedBenefitIds.length === 0) {
    return redirect(HRIS_ROUTES.benefits.base);
  }

  const parsedFilters = (filter ? filter.split(',') : ['ACTIVE']) as EmployeeStatusDto[];

  const parsedPerPage = perPage ? +perPage : undefined;

  const t = await getTranslations('company.benefits.assignPage');
  const tNext = await getNextTranslations('company.benefits.assignPage');
  const api = hrisApi;

  const [benefits, employees] = await Promise.all([
    api.benefits.getBenefitList(1, undefined, undefined, undefined),
    api.employees.getAllEmployeesList(
      +(page ?? 1),
      search ?? '',
      sort ?? 'lastName-desc',
      parsedPerPage,
      parsedFilters,
    ),
  ]);

  const selectedBenefits = benefits.items.filter((b) => parsedBenefitIds.includes(b.id));

  return (
    <div className="flex flex-1 flex-col justify-between">
      <div>
        <BasicHeader>{t('title')}</BasicHeader>
        <p className="pt-3">
          {t(selectedBenefits.length > 1 ? 'assignChosenBenefits' : 'assignChosenBenefit')}
        </p>
        {selectedBenefits.length > 0 && (
          <div className="pt-2">
            <p className="text-sm font-semibold">{t('selectedBenefits')}:</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedBenefits.map((benefit) => (
                <span key={benefit.id} className="bg-primary/10 rounded px-2 py-1 text-sm">
                  {benefit.name}
                </span>
              ))}
            </div>
          </div>
        )}
        <section className="flex gap-x-4 pb-2 pt-6">
          <SearchInput
            aria-label={tNext('search')}
            className="basis-full xl:basis-2/5"
            inputProps={{ placeholder: tNext('search') }}
          />
        </section>
        <section>
          <div className="hidden items-center gap-x-4 pb-6 pt-3.5 xl:flex">
            {employees._access.actions.includes('filter') && (
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
          </div>
        </section>
        <AssignEmployeeTable
          disallowEmptySelection
          aria-label="employees table"
          className="hidden xl:table"
          data={employees}
          selectionMode="multiple"
        />
        <AssignEmployeesGridList className="xl:hidden" data={employees} selectionMode="multiple" />
        <Pagination
          nextPage={employees.nextPage}
          prevPage={employees.prevPage}
          totalPages={employees.totalPages}
        />
      </div>
      <AssignEmployeesBottomButtons benefitIds={parsedBenefitIds} />
    </div>
  );
}
